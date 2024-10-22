# Guide
So you have chosen to get more knowledge about this project. Tzeentch would be proud. 

## Design & Best Practices
Most of the documentation can be found in issues.

### Backend
- Check out Issue https://gitlab.cern.ch/caimira/neutrinoreview/-/issues/50 
- We did too little testing since we included many cool features and had too little time. Thus be careful if you change something.


### Database
- Check out https://gitlab.cern.ch/caimira/neutrinoreview/-/issues/47
- Most other relevant things about databases are linked within the issues.

## FastAPI & Important files
- Here we decided to go with the file structure of https://github.com/zhanymkanov/fastapi-best-practices
- So in general we have 5 parts per topic:
  - Dependencies: which are used for fastAPIs dependency injection. This basically means to easily add stuff like services or validation to your endpoints.
  - Models: are used to create SQL tables. You cannot use those classes as response_model (at least to my knowledge). For that we are using...
  - Schemas: are used to define  request and response models. This way we have input/output validation and automatic data serialization.
  - Router: are our API endpoints. Try to have as little logic here as possible. Logic should be in...
  - Service: logic for our API endpoints.

### Workflow
For me the best workflow was like this:
1. Think about the things you want to do.
1. Create Request / Response schema (if needed). 
1. Write everything in API endpoint (aka in router file).
   - Never hardcode HTTP values, use starlette status (eg instead of 200 use status.HTTP_200_OK)
1. Do manual tests in swagger UI.
1. Refactor so that logic is in service file (and test! Don't skip as I did xD).


## SSO, Paas & Application Portal
### SSO
- For SSO, we currently have a token exchange setup. Check out https://gitlab.cern.ch/caimira/neutrinoreview/-/issues/76 for details. The chat might be overwhelming, but if you scroll to the bottom there is an in a nutshell.
- To get started with CERN SSO I recommend having a look on https://auth.docs.cern.ch/applications/examples/. Try to adapt this to work with our token exchange setup (Hint: client id = Frontend SSO, target = Backend SSO, no client secret needed)

### Paas
- Based on Open Shift
- Here the most important things for us are:
  - Administrator/Workload/Pods to check if there are errors and to see the log.
  - Administrator/Networking/Routes, 3 dots right of application, edit annotations to open / close it to the Internet (https://paas.docs.cern.ch/5._Exposing_The_Application/2-network-visibility/#adding-custom-annotations-to-a-route)
  - ! Developer/Topology, blue button underneath python logo (something like D neutri...-git), **rebuild after push** if the GitLab automatic build hook doesn't work.
  - Developer/Topology/same as aboth, but again pressing on the D neutrinoreview-git text on the top of the popped up window, Environment to set environment variables (Also you can get the SSO_FRONTEND_ID from here)
  - Developer/Secrets/custom-oidc-secret you can get SSO_BACKEND_ID (=clientID) and KC_SERVER(=issuerURL) here.

### Application Portal:
  - We have 2 applications (needed for token exchange, on Paas one cannot activate this), one for Frontend, one for Backend.
  - Here the most important options are in "SSO Registration" tab. Then for token exchange the blue lock button, for redirect URIs and Public Client the Orange button.
  - Redirecting URIs is needed because else the SSO will throw an error that our redirect URI is invalid (security measure).
  - Here we can also get Client ID Frontend, and Client ID / Secret Backend.
