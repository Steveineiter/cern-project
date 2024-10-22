from sqlalchemy import func, case, desc, asc, and_, or_

from src.manual_screening.schemas import PaperItem
from src.reviews.models import Tagging, EligibilityCriteria, Paper, PaperDetails
from src.reviews.service import get_review_model


def get_number_of_documents_to_manually_screen(db, review_id):
    threshold = get_review_model(db, review_id).llm_level_of_automation

    tagging_counts = (
        db.query(
            func.count(Tagging.review_id).label("total_count"),
        )
        .filter(
            Tagging.review_id == review_id,
            Tagging.neutrino_review_llm_tag <= threshold,
        )
        .one()
    )
    return tagging_counts.total_count or 0


def get_inclusion_exclusion_criteria_and_exclusion_labels(db, review_id):
    eligibility_criteria_model = (
        db.query(EligibilityCriteria)
        .filter(EligibilityCriteria.review_id == review_id)
        .all()
    )

    inclusion_criteria = [
        criteria.inclusion_criteria
        for criteria in eligibility_criteria_model
        if criteria.inclusion_criteria
    ]
    exclusion_criteria = [
        criteria.exclusion_criteria
        for criteria in eligibility_criteria_model
        if criteria.exclusion_criteria
    ]
    exclusion_criteria_labels = [
        criteria.pico_tag
        for criteria in eligibility_criteria_model
        if criteria.exclusion_criteria and criteria.pico_tag
    ]

    return inclusion_criteria, exclusion_criteria, exclusion_criteria_labels


def get_paper_model_and_tagging_model(db, review_id):
    threshold = get_review_model(db, review_id).llm_level_of_automation

    return (
        db.query(Paper, Tagging)
        .join(Tagging, Paper.paper_id == Tagging.paper_id)
        .outerjoin(PaperDetails, Paper.paper_id == PaperDetails.paper_id)
        .filter(
            Tagging.review_id == review_id,
            Tagging.neutrino_review_llm_tag <= threshold,
            Tagging.has_been_reviewed_by_user == False,
        )
        .first()
    )


def get_previous_paper_model_and_tagging_model(db, review_id, current_paper_id):
    return (
        db.query(Paper, Tagging)
        .join(Tagging, Paper.paper_id == Tagging.paper_id)
        .filter(
            Tagging.review_id == review_id,
            Paper.paper_id < current_paper_id,
        )
        .order_by(desc(Paper.paper_id))
        .first()
    )


def get_next_paper_model_and_tagging_model(db, review_id, current_paper_id):
    return (
        db.query(Paper, Tagging)
        .join(Tagging, Paper.paper_id == Tagging.paper_id)
        .filter(
            Tagging.review_id == review_id,
            Paper.paper_id > current_paper_id,
        )
        .order_by(asc(Paper.paper_id))
        .first()
    )


def paper_item_given_models(paper_model, tagging_model):
    paper_details = paper_model.paper_details
    if paper_details:
        return PaperItem(
            paper_id=paper_model.paper_id,
            title=paper_model.title,
            abstract=paper_model.abstract,
            authors=paper_details.authors
            or PaperItem.model_fields["authors"].get_default(),
            publication=paper_details.publication
            or PaperItem.model_fields["publication"].get_default(),
            doi=paper_details.doi or PaperItem.model_fields["doi"].get_default(),
            suggestion=tagging_model.neutrino_review_llm_tag,
        )

    return PaperItem(
        paper_id=paper_model.paper_id,
        title=paper_model.title,
        abstract=paper_model.abstract,
        suggestion=tagging_model.neutrino_review_llm_tag,
    )


def get_manually_excluded_and_included_count(db, review_id):
    query_result = (
        db.query(
            func.sum(
                case(
                    (
                        and_(
                            Tagging.has_been_reviewed_by_user == True,
                            Tagging.exclusion_reason.isnot(None),
                            Tagging.exclusion_reason != "",
                        ),
                        1,
                    ),
                    else_=0,
                )
            ).label("excluded_count"),
            func.sum(
                case(
                    (
                        and_(
                            Tagging.has_been_reviewed_by_user == True,
                            or_(
                                Tagging.exclusion_reason.is_(None),
                                Tagging.exclusion_reason == "",
                            ),
                        ),
                        1,
                    ),
                    else_=0,
                )
            ).label("included_count"),
        )
        .filter(Tagging.review_id == review_id)
        .one()
    )
    return query_result or (0, 0)


def current_paper_has_not_been_rated(db, review_id, current_paper_id):
    paper = (
        db.query(Paper)
        .join(Tagging, Paper.paper_id == Tagging.paper_id)
        .filter(
            Paper.paper_id == current_paper_id,
            Tagging.review_id == review_id,
            Tagging.has_been_reviewed_by_user == False,
        )
        .first()
    )
    return paper
