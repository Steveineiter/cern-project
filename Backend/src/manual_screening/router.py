from fastapi import APIRouter, Path, Query
from starlette import status

from src.automated_screening.service import (
    validate_user,
)
from src.constants import DONE
from src.manual_screening.constants import (
    ALL_PAPERS_SCREENED_MESSAGE,
    MOST_RECENT_PAPER_MESSAGE,
)
from src.manual_screening.schemas import (
    EligibilityCriteriaResponse,
    PaperResponse,
    ManualTaggingResultsResponse,
)
from src.manual_screening.schemas import UpdateTagging
from src.manual_screening.service import (
    get_paper_model_and_tagging_model,
    paper_item_given_models,
    get_manually_excluded_and_included_count,
    get_previous_paper_model_and_tagging_model,
    get_next_paper_model_and_tagging_model,
    current_paper_has_not_been_rated,
    get_inclusion_exclusion_criteria_and_exclusion_labels,
    get_number_of_documents_to_manually_screen,
)
from src.reviews.dependencies import user_dependency, db_dependency
from src.reviews.models import Tagging
from src.reviews.service import validate_user, get_review_model

manual_screening_router = APIRouter(prefix="/reviews", tags=["reviews"])


@manual_screening_router.get(
    "/{review_id}/eligibility-criteria",
    status_code=status.HTTP_200_OK,
    response_model=EligibilityCriteriaResponse,
)
async def get_eligibility_criteria_for_manual_screening(
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
):
    validate_user(user)

    inclusion_criteria, exclusion_criteria, exclusion_criteria_labels = (
        get_inclusion_exclusion_criteria_and_exclusion_labels(db, review_id)
    )
    screened_documents = get_number_of_documents_to_manually_screen(db, review_id)

    return EligibilityCriteriaResponse(
        inclusionCriteria=inclusion_criteria,
        exclusionCriteria=exclusion_criteria,
        labels=exclusion_criteria_labels,
        screenedDocuments=screened_documents,
    )


@manual_screening_router.get(
    "/{review_id}/manual-screening/next-paper",
    status_code=status.HTTP_200_OK,
    response_model=PaperResponse,
)
async def get_next_paper_for_manual_tagging(
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
):
    validate_user(user)

    query_result = get_paper_model_and_tagging_model(db, review_id)
    if query_result is None:  # This implies there are no papers left.
        return PaperResponse(
            message=ALL_PAPERS_SCREENED_MESSAGE, switch_to_results=True
        )

    paper_model, tagging_model = query_result
    paper = paper_item_given_models(paper_model, tagging_model)

    return PaperResponse(message="Paper found successfully.", paper=paper)


@manual_screening_router.patch(
    "/{review_id}/manual-screening/{paper_id}/decision",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def update_manual_tagging(
    tagging_request: UpdateTagging,
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
    paper_id: int = Path(gt=0),
):
    validate_user(user)
    tagging_model = (
        db.query(Tagging)
        .filter(
            Tagging.review_id == review_id,
            Tagging.paper_id == paper_id,
        )
        .first()
    )

    exclusion_string = ""
    if tagging_request.exclusion_reason:
        exclusion_string = "; ".join(tagging_request.exclusion_reason)

    tagging_model.exclusion_reason = exclusion_string
    tagging_model.has_been_reviewed_by_user = True

    db.add(tagging_model)
    db.commit()


@manual_screening_router.get(
    "/{review_id}/results-manual",
    status_code=status.HTTP_200_OK,
    response_model=ManualTaggingResultsResponse,
)
async def get_manual_tagging_results(
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
):
    validate_user(user)

    excluded_count, included_count = get_manually_excluded_and_included_count(
        db, review_id
    )
    results = [
        {"label": "Manually excluded", "value": excluded_count},
        {"label": "Manually included", "value": included_count},
    ]

    get_review_model(db, review_id).current_phase = DONE
    return ManualTaggingResultsResponse(
        results=results,
    )


@manual_screening_router.get(
    "/{review_id}/manual-screening/previous-article",
    status_code=status.HTTP_200_OK,
    response_model=PaperResponse,
)
async def get_previous_article(
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
    current_paper_id: int = Query(gt=0),
):
    validate_user(user)

    query_result = get_previous_paper_model_and_tagging_model(
        db, review_id, current_paper_id
    )
    if query_result is None:  # This implies there are no papers left.
        return PaperResponse(
            message=ALL_PAPERS_SCREENED_MESSAGE, switch_to_results=True
        )
    previous_paper_model, tagging_model = query_result
    paper = paper_item_given_models(previous_paper_model, tagging_model)

    return PaperResponse(message="Paper found successfully.", paper=paper)


@manual_screening_router.get(
    "/{review_id}/manual-screening/next-article",
    status_code=status.HTTP_200_OK,
    response_model=PaperResponse,
)
async def get_next_article(
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
    current_paper_id: int = Query(gt=0),
):
    validate_user(user)
    _message = "Paper found successfully."

    # If current paper hasn't been rated it means that we are on head of our list of papers we have to rate.
    paper = current_paper_has_not_been_rated(db, review_id, current_paper_id)
    if paper:
        # return PaperResponse(
        #     message=MOST_RECENT_PAPER_MESSAGE, switch_to_results=True
        # )
        current_paper_id -= 1  # So we get the same paper again.
        _message = MOST_RECENT_PAPER_MESSAGE

    query_result = get_next_paper_model_and_tagging_model(
        db, review_id, current_paper_id
    )
    if query_result is None:  # This implies there are no papers left.
        return PaperResponse(
            message=ALL_PAPERS_SCREENED_MESSAGE, switch_to_results=True
        )
    previous_paper_model, tagging_model = query_result
    paper = paper_item_given_models(previous_paper_model, tagging_model)

    return PaperResponse(message=_message, paper=paper)
