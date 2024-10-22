import csv
from io import StringIO
from typing import List

from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import StreamingResponse
from starlette import status

from src.automated_screening.service import get_llm_total_include_exclude_tagging_counts
from src.manual_screening.service import (
    get_manually_excluded_and_included_count,
)
from src.models import Users, Review, UserRightsInReview
from src.reviews.dependencies import user_dependency, db_dependency
from src.reviews.models import EligibilityCriteria
from src.reviews.schemas import (
    CreateReview,
    CreateEligibilityCriteria,
    EditReviewTitle,
    ReviewResultResponse,
)
from src.reviews.service import (
    validate_user,
    get_review_model,
    parse_statistics,
    parse_prisma_diagram_data,
    get_paper_models_and_tagging_models,
    result_paper_item_given_model,
    get_human_exclusion_prisma_values,
    get_csv_content,
)
from src.users.service import _create_user

reviews_router = APIRouter(prefix="/reviews", tags=["reviews"])


@reviews_router.get("/{specific_review_id}", status_code=status.HTTP_200_OK)
async def read_specific_review_of_user(
    user: user_dependency, db: db_dependency, specific_review_id: int = Path(gt=0)
):
    validate_user(user)
    review_model = (
        db.query(Review)
        .join(UserRightsInReview, Review.review_id == UserRightsInReview.review_id)
        .filter(UserRightsInReview.cern_upn == user.get("cern_upn"))
        .filter(Review.review_id == specific_review_id)
        .first()
    )

    eligibility_criteria_model = (
        db.query(EligibilityCriteria)
        .filter(EligibilityCriteria.review_id == specific_review_id)
        .all()
    )

    if review_model and eligibility_criteria_model:
        return {
            "review_model": review_model,
            "eligibility_model": eligibility_criteria_model,
        }
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="No review was found."
    )


@reviews_router.get("/", status_code=status.HTTP_200_OK)
async def read_all_reviews_of_user(user: user_dependency, db: db_dependency):
    validate_user(user)

    review_model = (
        db.query(Review)
        .join(UserRightsInReview, Review.review_id == UserRightsInReview.review_id)
        .filter(UserRightsInReview.cern_upn == user.get("cern_upn"))
        .all()
    )
    if review_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No review was found."
        )

    return review_model


# If you wonder why we don't need rollback or so: That's because we use the db_dependency. Aka if something fails it
#  won't come to the db.commit(), and then the connection will be closed.
@reviews_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_review(
    review_request: CreateReview,
    criteria_requests: List[CreateEligibilityCriteria],
    db: db_dependency,
    user: user_dependency,
):
    validate_user(user)

    # Since we only get cern_upn, mail and names we need to get the user object.
    user = db.query(Users).filter(
        Users.cern_upn == user.get("cern_upn")
    ).first() or _create_user(db, user)

    new_review = Review(**review_request.model_dump())
    db.add(new_review)

    user_rights = UserRightsInReview(
        users=user,
        review=new_review,
        is_owner=True,
        is_reviewer=True,
    )
    db.add(user_rights)

    for criteria in criteria_requests:
        new_criteria = EligibilityCriteria(
            review=new_review,
            pico_tag=criteria.pico_tag,
            inclusion_criteria=criteria.inclusion_criteria,
            exclusion_criteria=criteria.exclusion_criteria,
        )
        db.add(new_criteria)

    db.commit()
    db.refresh(new_review)
    return new_review


@reviews_router.delete(
    "/{review_id_to_delete}/delete", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_review(
    user: user_dependency, db: db_dependency, review_id_to_delete: int = Path(gt=0)
):
    validate_user(user)

    review_model = (
        db.query(Review.review_id)
        .filter(Review.review_id == review_id_to_delete)
        .join(UserRightsInReview, Review.review_id == UserRightsInReview.review_id)
        .filter(UserRightsInReview.cern_upn == user.get("cern_upn"))
        .first()
    )
    if review_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found."
        )

    # synchronize_session should be fine, as long as we don't store the results of the model into a variable.
    db.query(Review).filter(Review.review_id == review_id_to_delete).delete(
        synchronize_session=False
    )
    db.commit()


@reviews_router.patch(
    "/{review_id_to_edit}/edit-title", status_code=status.HTTP_204_NO_CONTENT
)
async def edit_title(
    edit_title_request: EditReviewTitle,
    user: user_dependency,
    db: db_dependency,
    review_id_to_edit: int = Path(gt=0),
):
    validate_user(user)
    review_model = (
        db.query(Review)
        .filter(Review.review_id == review_id_to_edit)
        .join(UserRightsInReview, Review.review_id == UserRightsInReview.review_id)
        .filter(UserRightsInReview.cern_upn == user.get("cern_upn"))
        .first()
    )
    if review_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found."
        )

    review_model.review_title = edit_title_request.title

    db.add(review_model)
    db.commit()


@reviews_router.get(
    "/{review_id}/results",
    status_code=status.HTTP_200_OK,
    response_model=ReviewResultResponse,
)
async def get_review_results(
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
):
    validate_user(user)
    review_model = get_review_model(db, review_id)
    _, llm_included, llm_excluded = get_llm_total_include_exclude_tagging_counts(
        db, review_model
    )
    manually_excluded, manually_included = get_manually_excluded_and_included_count(
        db, review_id
    )

    results_statistics = parse_statistics(
        llm_included, llm_excluded, manually_included, manually_excluded
    )
    prisma_diagram_data = parse_prisma_diagram_data(
        llm_included,
        llm_excluded,
        manually_included,
        manually_excluded,
        get_human_exclusion_prisma_values(db, review_id),
    )
    query_result = get_paper_models_and_tagging_models(db, review_id)
    if query_result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No papers where found."
        )
    papers_of_review = [
        result_paper_item_given_model(paper_model, tagging_model)
        for (paper_model, tagging_model) in query_result
    ]

    return ReviewResultResponse(
        prismaData=prisma_diagram_data,
        statistics=results_statistics,
        papers=papers_of_review,
    )


@reviews_router.get(
    "/{review_id}/results/csv",
    status_code=status.HTTP_200_OK,
)
async def download_results_as_csv(
    user: user_dependency,
    db: db_dependency,
    review_id: int = Path(gt=0),
):
    validate_user(user)
    csv_items = get_csv_content(db, review_id)
    csv_content = StringIO()
    writer = csv.writer(csv_content)

    writer.writerow(
        [
            "Paper ID",
            "Included / Excluded",
            "Title",
            "Publication Year",
            "Authors",
            "Abstract",
            "DOI",
            "Screener",
        ]
    )
    for item in csv_items:
        writer.writerow(item)

    csv_content.seek(0)
    response = StreamingResponse(iter([csv_content.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = (
        "attachment; filename=systematic_review_data.csv"
    )
    response.headers["Content-type"] = "text/csv"

    return response
