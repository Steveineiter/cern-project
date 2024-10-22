from typing import List

from pydantic import BaseModel


class EligibilityCriteriaResponse(BaseModel):
    inclusionCriteria: List[str]
    exclusionCriteria: List[str]
    labels: List[str]
    screenedDocuments: int


class PaperItem(BaseModel):
    paper_id: int
    title: str
    abstract: str
    authors: str = "No author included."
    publication: str = "No publication included."
    doi: str = "No DOI included."
    suggestion: int


class PaperResponse(BaseModel):
    message: str
    switch_to_results: bool = False
    paper: PaperItem | None = None


class UpdateTagging(BaseModel):
    exclusion_reason: List[str] | None = None
    manual_tag: (
        bool  # TODO remove this in frontend, then in backend. We only need the reason.
    )


class ResultItem(BaseModel):
    label: str
    value: int


class ManualTaggingResultsResponse(BaseModel):
    results: List[ResultItem]
