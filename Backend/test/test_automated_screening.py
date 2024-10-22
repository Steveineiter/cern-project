# Generated by ChatGPT o1
#  TODO this means tests might be unstable / not correct. So if a test fails ponder if its your code or the test case.

from unittest.mock import patch, MagicMock

import pytest
import pytest_asyncio
from fastapi import status, BackgroundTasks
from httpx import AsyncClient, ASGITransport

from src.app import app  # Import your FastAPI app instance
from src.authentication.router import get_current_user  # Adjust import as needed
from src.constants import (
    LLM_SCREENING_AUTOMATION_CONTINUED,
    MANUAL_SCREENING,
)
from src.reviews.dependencies import db_dependency


@pytest_asyncio.fixture
def db_session():
    # Mocked database session
    return MagicMock()


@pytest_asyncio.fixture
def review_id():
    return 1


@pytest_asyncio.fixture
def background_tasks():
    return BackgroundTasks()


@pytest_asyncio.fixture
def llm_level_of_automation_request():
    return {"llm_level_of_automation": 2}


@pytest_asyncio.fixture
async def async_client(db_session):
    async def override_get_current_user():
        return {
            "cern_upn": "user@cern.ch",
            "email": "user@cern.ch",
            "given_name": "First",
            "family_name": "Last",
        }

    # Override dependencies
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[db_dependency] = lambda: db_session

    # Use ASGITransport as per the deprecation warning fix
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

    app.dependency_overrides = {}


@pytest.mark.asyncio
async def test_stop_resume_llm_invalid_action(
    async_client,
    db_session,
    review_id,
):
    invalid_action = 9  # Outside the allowed range of 7 to 8

    response = await async_client.patch(
        f"/reviews/{review_id}/automated-screening/progress/action",
        params={"action": invalid_action},
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # Adjust the assertion to match the new error message format
    error_detail = response.json()
    assert "less than or equal to 8" in error_detail["detail"][0]["msg"]


@pytest.mark.asyncio
async def test_get_llm_progress_zero_total_count(
    async_client,
    db_session,
    review_id,
):
    review_model = MagicMock()
    review_model.current_phase = LLM_SCREENING_AUTOMATION_CONTINUED

    with patch(
        "src.automated_screening.router.get_review_model", return_value=review_model
    ), patch(
        "src.automated_screening.router.get_llm_total_include_exclude_tagging_counts",
        return_value=(0, 0, 0),
    ):
        response = await async_client.get(
            f"/reviews/{review_id}/automated-screening/progress",
        )
        assert response.status_code == status.HTTP_200_OK
        response_data = response.json()

        assert response_data["progress"] == 100
        assert response_data["remainingTime"] == 0
        assert response_data["screenedDocuments"] == "0 / 0"
        assert response_data["results"] == [
            {"label": "Excluded by NeutrinoReview", "value": 0},
            {"label": "Included by NeutrinoReview", "value": 0},
            {"label": "Human screening required", "value": 0},
        ]
        assert response_data["state"] == MANUAL_SCREENING
        assert review_model.current_phase == MANUAL_SCREENING
