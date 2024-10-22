import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import src.models as global_models
from src.authentication.router import authentication_router
from src.automated_screening.router import automated_screening_router
from src.database import engine
from src.manual_screening import models as manual_screening_models
from src.manual_screening.router import manual_screening_router
from src.reviews import models as review_models
from src.reviews.router import reviews_router
from src.users import models as users_models
from src.users.router import users_router

app = FastAPI(
    docs_url=None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://neutrino-review.web.cern.ch"],
    allow_credentials=True,
    allow_methods=["OPTIONS", "GET", "PATCH", "POST", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)


manual_screening_models.Base.metadata.create_all(bind=engine)
review_models.Base.metadata.create_all(bind=engine)
users_models.Base.metadata.create_all(bind=engine)
global_models.Base.metadata.create_all(bind=engine)


# TODO if we have included search api:
#   - If its done, set review.current_phase to constants.LLM_SCREENING_AUTOMATION
app.include_router(authentication_router)
app.include_router(automated_screening_router)
app.include_router(manual_screening_router)
app.include_router(reviews_router)
app.include_router(users_router)


@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}


# added while troubleshooting of deployment
if __name__ == "__app__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
