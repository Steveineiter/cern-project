# Generated by ChatGPT o1
#  TODO this means tests might be unstable / not correct. So if a test fails ponder if its your code or the test case.


import pytest
from fastapi import status
from httpx import AsyncClient

from src.app import app
from src.users.dependencies import get_current_user, get_db


# Mock dependencies
async def mock_get_current_user():
    return {"cern_upn": "test_user"}


async def mock_get_current_user_none():
    return None


def mock_get_db():
    return MockDBSession()


class MockDBSession:
    def __init__(self):
        self.users = []

    def query(self, model):
        self.query_model = model
        return self

    def filter(self, condition):
        # Extract the value being filtered (cern_upn)
        field_name, value = self._parse_condition(condition)
        # Filter the users based on the condition
        self.filtered_users = [
            user for user in self.users if getattr(user, field_name) == value
        ]
        return self

    def _parse_condition(self, condition):
        # Extract the field name and value from the condition
        # This assumes the condition is of the form Users.cern_upn == value
        field_name = condition.left.key
        value = condition.right.value
        return field_name, value

    def delete(self):
        for user in self.filtered_users:
            self.users.remove(user)

    def commit(self):
        pass

    def first(self):
        return self.filtered_users[0] if self.filtered_users else None

    def add(self, user):
        self.users.append(user)


# Mock Users model
class MockUser:
    def __init__(self, cern_upn):
        self.cern_upn = cern_upn


# Override dependencies
app.dependency_overrides[get_current_user] = mock_get_current_user
app.dependency_overrides[get_db] = mock_get_db


@pytest.mark.asyncio
async def test_create_user_unauthorized():
    app.dependency_overrides[get_current_user] = mock_get_current_user_none
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/users/", json={"cern_upn": "test_user"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    app.dependency_overrides[get_current_user] = mock_get_current_user


@pytest.mark.asyncio
async def test_delete_user_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.delete("/users/")
    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.asyncio
async def test_delete_user_unauthorized():
    app.dependency_overrides[get_current_user] = mock_get_current_user_none
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.delete("/users/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    # Reset override
    app.dependency_overrides[get_current_user] = mock_get_current_user


@pytest.mark.asyncio
async def test_get_logged_in_user_unauthorized():
    app.dependency_overrides[get_current_user] = mock_get_current_user_none
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/users/logged_in_user")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    # Reset override
    app.dependency_overrides[get_current_user] = mock_get_current_user
