from fastapi import HTTPException
from sqlalchemy import func, case, and_
from starlette import status

from src.automated_screening.service_llm import query_cern_llama3
from src.constants import LLM_SCREENING_AUTOMATION_CONTINUED, NO_LABEL
from src.models import Review
from src.reviews.models import Paper, Tagging, EligibilityCriteria
from src.reviews.service import get_review_model


def validate_user(user):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")


def set_current_review_phase(action, db, review_id):
    review_model = db.query(Review).filter(Review.review_id == review_id).first()
    if review_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found."
        )
    review_model.current_phase = action
    db.add(review_model)
    db.commit()


def resume_llm_background_task(db, review_id):
    while True:
        # ----- Check if we should stop with the process. ------
        print("In llm background task")
        if has_task_been_revoked(db, review_id):
            break
        paper_model = get_paper_model(db, review_id)
        if paper_model is None:  # This indicates that we have tagged all papers.
            break

        # ----- Call LLM. --------------------------------------
        eligibility_criteria_model = get_eligibility_criteria_model(db, review_id)
        neutrino_review_llm_tag, tokens_used_by_llm = query_cern_llama3(
            paper_model.title, paper_model.abstract, eligibility_criteria_model
        )

        # ----- Update tagging database ------------------------
        update_tagging_item(
            db, neutrino_review_llm_tag, paper_model, review_id, tokens_used_by_llm
        )


def has_task_been_revoked(db, review_id):
    # Check if the task has been revoked by querying for the current phase
    review_model = get_review_model(db, review_id)
    if review_model.current_phase != LLM_SCREENING_AUTOMATION_CONTINUED:
        return True


def get_paper_model(db, review_id):
    paper_model = (
        db.query(Paper)
        .join(Tagging)
        .filter(Tagging.review_id == review_id)
        .filter(Tagging.neutrino_review_llm_tag == NO_LABEL)
        .first()
    )
    return paper_model


def get_eligibility_criteria_model(db, review_id):
    eligibility_criteria_model = (
        db.query(EligibilityCriteria)
        .filter(EligibilityCriteria.review_id == review_id)
        .all()
    )
    if eligibility_criteria_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found."
        )
    return eligibility_criteria_model


def update_tagging_item(
    db, neutrino_review_llm_tag, paper_model, review_id, tokens_used_by_llm
):
    tagging_model = (
        db.query(Tagging)
        .filter(
            Tagging.review_id == review_id,
        )
        .filter(Tagging.paper_id == paper_model.paper_id)
        .first()
    )
    if tagging_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tagging not found."
        )
    tagging_model.tokens_used_by_llm = tokens_used_by_llm
    tagging_model.neutrino_review_llm_tag = neutrino_review_llm_tag
    db.add(tagging_model)
    db.commit()


def get_llm_total_include_exclude_tagging_counts(db, review_model):
    threshold = review_model.llm_level_of_automation

    # Get Tagging model for reviewID / get total count, negatively and positively rated items of tagging items.
    tagging_counts = (
        db.query(
            func.count(Tagging.review_id).label("total_count"),
            func.sum(
                case(
                    (
                        and_(
                            Tagging.neutrino_review_llm_tag > 0,
                            Tagging.neutrino_review_llm_tag <= threshold,
                        ),
                        1,
                    ),
                    else_=0,
                )
            ).label("positive_count"),
            func.sum(
                case(
                    (
                        Tagging.neutrino_review_llm_tag > threshold,
                        1,
                    ),
                    else_=0,
                )
            ).label("negative_count"),
        )
        .filter(Tagging.review_id == review_model.review_id)
        .one()
    )
    return (
        tagging_counts.total_count if tagging_counts.total_count else 0,
        tagging_counts.positive_count if tagging_counts.positive_count else 0,
        tagging_counts.negative_count if tagging_counts.negative_count else 0,
    )
