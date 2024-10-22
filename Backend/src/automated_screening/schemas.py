from typing import List

from pydantic import BaseModel


class EditLLMLevelOfAutomation(BaseModel):
    llm_level_of_automation: int


class ResultItem(BaseModel):
    label: str
    value: int


class LLMProgressResponse(BaseModel):
    progress: float
    remainingTime: float
    screenedDocuments: str
    results: List[ResultItem]
    state: int
