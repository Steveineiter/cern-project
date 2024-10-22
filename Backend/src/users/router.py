from fastapi import APIRouter, HTTPException
from starlette import status

from src.models import Users
from src.users.dependencies import db_dependency, user_dependency
from src.users.service import _create_user

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: user_dependency, db: db_dependency):
    _create_user(db, user)


@users_router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed"
        )

    db.query(Users).filter(Users.cern_upn == user.get("cern_upn")).delete()
    db.commit()


@users_router.get("/logged_in_user", status_code=status.HTTP_200_OK)
async def get_logged_in_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed"
        )
    return db.query(Users).filter(Users.cern_upn == user.get("cern_upn")).first()
