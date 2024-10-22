from typing import Annotated

import requests
from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import JWTError
from jose import jwt
from starlette import status

from src.constants import (
    KEYCLOAK_AUTHORIZATION,
    KEYCLOAK_TOKEN,
    SSO_BACKEND_ID,
    SSO_FRONTEND_ID,
)

authentication_router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=KEYCLOAK_AUTHORIZATION,
    tokenUrl=KEYCLOAK_TOKEN,
    refreshUrl=KEYCLOAK_TOKEN,
)


# TODO ponder to change it, such that we return a User object, since this should fully use ORM.
async def get_current_user(access_token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        exchanged_access_token = exchange_token(access_token)
        jwks = get_keycloak_public_key()
        payload = jwt.decode(
            exchanged_access_token,
            jwks,
            algorithms=["RS256"],
            audience=SSO_BACKEND_ID,
            issuer="https://auth.cern.ch/auth/realms/cern",
        )

        # print(payload)  # TODO remove in production I guess, or move to logging.
        cern_upn: str = payload.get("cern_upn")
        email: str = payload.get("email")
        given_name: str = payload.get("given_name")
        family_name: str = payload.get("family_name")

        if cern_upn is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user.",
            )

        return {
            "cern_upn": cern_upn,
            "email": email,
            "given_name": given_name,
            "family_name": family_name,
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user."
        )


def exchange_token(access_token: str) -> str:
    data = {
        "client_id": SSO_FRONTEND_ID,
        "subject_token": access_token,
        "audience": SSO_BACKEND_ID,
        "scope": "openid",
        "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
        "subject_token_type": "urn:ietf:params:oauth:token-type:access_token",
    }

    response = requests.post(
        KEYCLOAK_TOKEN,
        data=data,
    )

    if response.status_code == 200:
        exchanged_token = response.json().get("access_token")
        return exchanged_token
    else:
        raise Exception(f"Token exchange failed: {response.text}")


def get_keycloak_public_key():
    jwks_url = "https://auth.cern.ch/auth/realms/cern/protocol/openid-connect/certs"
    response = requests.get(jwks_url)
    jwks = response.json()
    return jwks
