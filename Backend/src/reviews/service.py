from fastapi import HTTPException
from sqlalchemy import func
from starlette import status

from src.models import Review
from src.reviews.models import Tagging, Paper, PaperDetails
from src.reviews.schemas import PaperResultItem, Statistics, PrismaValue, PrismaDataItem


# Decision to have duplicated code, so that if we want a different user validation in reviews we can do this here.
def validate_user(user):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")


def get_review_model(db, review_id):
    review_model = db.query(Review).filter(Review.review_id == review_id).first()
    if review_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found."
        )
    return review_model


def parse_statistics(llm_included, llm_excluded, manually_included, manually_excluded):
    total_llm = llm_included + llm_excluded
    total_manually = manually_included + manually_excluded
    total_included = llm_included + manually_included
    total_excluded = llm_excluded + manually_excluded

    # Create the statistics list
    return [
        Statistics(id=1, label="Total paper", value=total_llm),
        Statistics(
            id=2,
            label="Screened only by Neutrino Review",
            value=total_llm - total_manually,
        ),
        Statistics(id=3, label="Manually screened", value=total_manually),
        Statistics(id=4, label="Total excluded", value=total_excluded),
        Statistics(id=5, label="Total included", value=total_included),
        Statistics(id=6, label="Excluded by Neutrino Review", value=llm_excluded),
        Statistics(id=7, label="Included by Neutrino Review", value=llm_included),
        Statistics(id=8, label="Manually included", value=manually_included),
        Statistics(id=9, label="Manually excluded", value=manually_excluded),
    ]


def parse_prisma_diagram_data(
    llm_included,
    llm_excluded,
    manually_included,
    manually_excluded,
    human_exclusion_prisma_values,
):
    total_llm = llm_included + llm_excluded
    total_manually = manually_included + manually_excluded
    return [
        PrismaDataItem(
            id=1,
            label="Records screened by Neutrino Review",
            value=total_llm,
            name="screened_ai",
        ),
        PrismaDataItem(
            id=2,
            label="Total",
            value=total_llm,
        ),
        PrismaDataItem(
            id=3,
            label="Records requiring manual screening",
            value=total_manually,
        ),
        PrismaDataItem(
            id=4,
            label="Reports assessed for eligibility by Neutrino Review",
            value=llm_included,
        ),
        PrismaDataItem(
            id=5,
            label="Reports assessed for eligibility by human screener",
            value=manually_included,
        ),
        PrismaDataItem(
            id=6,
            label="Human exclusion",
            human_exclusion_prisma_values=human_exclusion_prisma_values,
        ),
        PrismaDataItem(
            id=7,
            label="Reports sought for retrieval",
            value=total_manually,
        ),
    ]


def get_human_exclusion_prisma_values(db, review_id):
    tagging_model = (
        db.query(
            Tagging.exclusion_reason,
            func.count(Tagging.exclusion_reason).label("exclusion_count"),
        )
        .filter(Tagging.review_id == review_id, Tagging.exclusion_reason.isnot(None))
        .group_by(Tagging.exclusion_reason)
        .all()
    )

    exclusion_list = [
        PrismaValue(
            label=tagging_item.exclusion_reason, value=tagging_item.exclusion_count
        )
        for tagging_item in tagging_model
    ]
    exclusion_list.sort(key=lambda x: x.value, reverse=True)
    other_count = sum(item.value for item in exclusion_list[4:])
    total_count = sum(item.value for item in exclusion_list)

    result = exclusion_list[:4]
    result.append(PrismaValue(label="Other", value=other_count))
    result.append(PrismaValue(label="Total", value=total_count))

    return result


def get_paper_models_and_tagging_models(db, review_id):
    return (
        db.query(Paper, Tagging)
        .join(Tagging, Paper.paper_id == Tagging.paper_id)
        .outerjoin(PaperDetails, Paper.paper_id == PaperDetails.paper_id)
        .filter(
            Tagging.review_id == review_id,
        )
        .all()
    )


def result_paper_item_given_model(paper_model, tagging_model):
    paper_details = paper_model.paper_details

    authors = (
        paper_details.authors
        if paper_details
        else PaperResultItem.model_fields["authors"].get_default()
    )
    manual_tag = (
        tagging_model.exclusion_reason in ("", None)
        if tagging_model.has_been_reviewed_by_user
        else PaperResultItem.model_fields["manual_tag"].get_default()
    )
    exclusion_reason = (
        tagging_model.exclusion_reason
        or PaperResultItem.model_fields["exclusion_reason"].get_default()
    )
    screener = (
        "User"
        if tagging_model.has_been_reviewed_by_user
        else PaperResultItem.model_fields["screener"].get_default()
    )

    return PaperResultItem(
        paper_id=paper_model.paper_id,
        title=paper_model.title,
        authors=authors,
        manual_tag=manual_tag,  # 0 if excluded, 1 if included, None if not reviewed by user.
        exclusion_reason=exclusion_reason,
        screener=screener,
    )


# Returns [
#     ["Paper ID", "Included / Excluded", "Title", "Publication Year", "Authors", "Abstract", "DOI", "Screener"]
# ]
def get_csv_content(db, review_id):
    query_result = get_paper_models_and_tagging_models(db, review_id)
    if query_result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No papers where found."
        )
    return [
        csv_paper_item_given_model(paper_model, tagging_model)
        for (paper_model, tagging_model) in query_result
    ]


def csv_paper_item_given_model(paper_model, tagging_model):
    paper_details = paper_model.paper_details

    paper_id = paper_model.paper_id
    excluded_included = (
        "Included"
        if tagging_model.exclusion_reason in ("", None)
        and tagging_model.has_been_reviewed_by_user
        else "Excluded"  # TODO hier weiter, wsl kann i sagen entweder nimm des vom user oder Exclude
    )
    title = (paper_model.title,)
    publication_year = paper_details.date if paper_details else None
    authors = paper_details.authors if paper_details else None
    abstract = paper_model.abstract
    doi = paper_details.doi if paper_details else None
    screener = "User" if tagging_model.has_been_reviewed_by_user else "Neutrino Review"
    return [
        paper_id,
        excluded_included,
        title,
        publication_year,
        authors,
        abstract,
        doi,
        screener,
    ]
