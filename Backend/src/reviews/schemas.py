from datetime import datetime
from typing import List

from pydantic import BaseModel

from src.constants import SEARCH


class CreateReview(BaseModel):
    review_title: str
    review_research_question: str
    current_phase: int = SEARCH
    llm_level_of_automation: int | None = None
    creation_timestamp: datetime = datetime.now()
    ending_timestamp: datetime | None = None
    last_modified: datetime = datetime.now()
    llm_screening_seconds_used: int | None = None

    class Config:
        from_attributes = True


class CreateEligibilityCriteria(BaseModel):
    pico_tag: str
    inclusion_criteria: str | None = None
    exclusion_criteria: str | None = None

    # @model_validator(mode="before")
    # def check_at_least_one_criteria(self, values):
    #     inclusion_criteria = values.get('inclusion_criteria')
    #     exclusion_criteria = values.get('exclusion_criteria')
    #     if not inclusion_criteria and not exclusion_criteria:
    #         raise ValueError('At least one of inclusion_criteria or exclusion_criteria must be set.')
    #     return values


class EditReviewTitle(BaseModel):
    title: str


class PaperResultItem(BaseModel):
    paper_id: int
    title: str
    # abstract: str
    authors: str | None = "No author included."
    # publication: str = "No publication included."
    # doi: str = "No DOI included."
    # suggestion: int
    manual_tag: bool | None = None
    exclusion_reason: str | None = None
    # TODO Neutrino Review or User who had tagged the object, we need to implement this in DB if we want to work with eg names.
    screener: str = "Neutrino Review"


class Statistics(BaseModel):
    id: int
    label: str
    value: int


class PrismaValue(BaseModel):
    label: str
    value: int


class PrismaDataItem(BaseModel):
    id: int
    label: str
    name: str | None = None
    # Most entries have only one "value" instead of "human_exclusion_prisma_values"
    value: int | None = None
    human_exclusion_prisma_values: List[PrismaValue] | None = None


# Define the response model for the entire response
class ReviewResultResponse(BaseModel):
    prismaData: List[PrismaDataItem]
    statistics: List[Statistics]
    papers: List[PaperResultItem]
