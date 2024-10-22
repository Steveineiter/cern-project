import os

# Environment Variables
POSTGRES_STRING = os.getenv("POSTGRES_STRING")
SSO_FRONTEND_ID = os.getenv("SSO_FRONTEND_ID")
SSO_BACKEND_ID = os.getenv("sso_clientID")  # From paas secret.
KC_SERVER = os.getenv("sso_issuerURL")  # From paas secret.

# Other Consts
KEYCLOAK_AUTHORIZATION = KC_SERVER + "/protocol/openid-connect/auth"
KEYCLOAK_TOKEN = KC_SERVER + "/protocol/openid-connect/token"


# Should be equally defined as the consts in frontend.
# Page states
STOPPED = 0
SEARCH = 1
LLM_SCREENING_AUTOMATION_SELECTION = 2
LLM_SCREENING = 3
MANUAL_SCREENING = 4
DONE = 5
LLM_SCREENING_AUTOMATION_PAUSED = 7
LLM_SCREENING_AUTOMATION_CONTINUED = 8

# Neutrino review LLM tag
NO_LABEL = 0
HIGHLY_RELEVANT = 1
PROBABLY_RELEVANT = 2
UNDECIDABLE = 3
PROBABLY_IRRELEVANT = 4
NOT_RELEVANT = 5
