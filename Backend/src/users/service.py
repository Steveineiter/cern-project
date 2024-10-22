from fastapi import HTTPException
from starlette import status

from src.models import Users


def _create_user(db, user):
    validate_user(user)
    if (
        db.query(Users).filter(Users.cern_upn == user.get("cern_upn")).first()
        is not None
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="User already exists."
        )

    user_model = Users(cern_upn=user.get("cern_upn"), user_email=user.get("email"))
    db.add(user_model)
    db.commit()

    return user_model


def validate_user(user):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed"
        )
