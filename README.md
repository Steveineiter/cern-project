# A Guide about the Backend can be found  in .\Backend\README.md

# Installation Guide for Windows system 

First requirements are to install Node.js and Python

## Steps to locally run the project

1. Download the repository locally.

```bash
git clone https://gitlab.cern.ch/caimira/neutrinoreview.git
```

2. Open Command Prompt and switch into that repository 

3. Changed the position into Backend folder

```bash
cd  .\Backend\ 
```

4. Set environment variables

- See Backend\src\constants for an overview which you have to set. The details can be found on Paas and Application Portal.

5. Create Python virtual environment

```bash
 python –m venv <name_of_virtualenv>
```

6. Activate environment

```bash
  <name_of_virtualenv>\Scripts\activate
```

7. Install all packages

```bash
  pip install -r requirements.txt
```

8. Run fastAPI on uvicorn server

```bash
  uvicorn src.app:app --reload --port=8000
```

9. Open new Command Prompt and switch into repository where is cloned the repository from GitLab 

10. Changed the position into Frontend folder

```bash
  cd  .\Frontend\
```

11. Install all dependencies

```bash
  npm install
```

12. Run application

```bash
  npm run dev
```

13. Open application in the browser with the URI http://localhost:5173/