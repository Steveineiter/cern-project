from fastapi import APIRouter, HTTPException, Path, Query, BackgroundTasks
from starlette import status

from src.automated_screening.schemas import (
    EditLLMLevelOfAutomation,
    LLMProgressResponse,
)
from src.automated_screening.service import (
    validate_user,
    set_current_review_phase,
    resume_llm_background_task,
    get_llm_total_include_exclude_tagging_counts,
)
from src.constants import (
    LLM_SCREENING_AUTOMATION_CONTINUED,
    LLM_SCREENING_AUTOMATION_SELECTION,
    MANUAL_SCREENING,
)
from src.models import Review, UserRightsInReview
from src.reviews.dependencies import user_dependency, db_dependency
from src.reviews.service import validate_user, get_review_model

automated_screening_router = APIRouter(prefix="/reviews", tags=["reviews"])


@automated_screening_router.patch(
    "/{review_id}/automated-screening/llm-automation-level",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def edit_level_of_automation(
    llm_level_of_automation_request: EditLLMLevelOfAutomation,
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
):
    validate_user(user)
    review_model = (
        db.query(Review)
        .filter(Review.review_id == review_id)
        .join(UserRightsInReview, Review.review_id == UserRightsInReview.review_id)
        .filter(UserRightsInReview.cern_upn == user.get("cern_upn"))
        .first()
    )
    if review_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found."
        )

    review_model.llm_level_of_automation = (
        llm_level_of_automation_request.llm_level_of_automation
    )
    review_model.current_phase = LLM_SCREENING_AUTOMATION_SELECTION

    db.add(review_model)
    db.commit()


# TODO add a fail check that we can only change this if we are in certain phase
# TODO add time tracking Review.llm_screening_seconds_used in background task. Maybe switch to milli seconds
# From Constants in Frontend: LLM_SCREENING_AUTOMATION_PAUSED: 7, LLM_SCREENING_AUTOMATION_CONTINUED: 8,
@automated_screening_router.patch(
    "/{review_id}/automated-screening/progress/action",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def stop_resume_llm(
    user: user_dependency,
    db: db_dependency,
    background_tasks: BackgroundTasks,
    review_id: int = Path(gt=0),
    action: int = Query(ge=7, le=8),
):
    validate_user(user)

    set_current_review_phase(action, db, review_id)

    if action == LLM_SCREENING_AUTOMATION_CONTINUED:
        background_tasks.add_task(resume_llm_background_task, db, review_id)


# TODO calculate remaining time using Review.llm_screening_seconds_used * count(unlabeled data)
@automated_screening_router.get(
    "/{review_id}/automated-screening/progress",
    status_code=status.HTTP_200_OK,
    response_model=LLMProgressResponse,
)
async def get_llm_progress(
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
):
    validate_user(user)
    review_model = get_review_model(db, review_id)
    total_count, include_count, exclude_count = (
        get_llm_total_include_exclude_tagging_counts(db, review_model)
    )

    progress = (
        (((include_count + exclude_count) / total_count) * 100)
        if total_count != 0
        else 100
    )
    # Calculate remaining time (assuming .5 second per query) TODO make this based on Review.llm_screening_seconds_used
    remaining_time = (total_count - (include_count + exclude_count)) * 0.5
    screened_documents = f"{(include_count + exclude_count)} / {total_count}"
    results = [
        {"label": "Excluded by NeutrinoReview", "value": exclude_count},
        {"label": "Included by NeutrinoReview", "value": include_count},
        {"label": "Human screening required", "value": include_count},
    ]

    if progress == 100:
        review_model.current_phase = MANUAL_SCREENING

    return LLMProgressResponse(
        progress=progress,
        remainingTime=remaining_time,
        screenedDocuments=screened_documents,
        results=results,
        state=review_model.current_phase,
    )
