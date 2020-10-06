# Ranked Sudoku Backend

Developed with Python 3.7.1

## Getting started VS code:

### Install linting

`pip install pylint`  
`pip install pylint-flask`  
`pip install pylint-flask-sqlalchemy`

Inside .vscode folder, inside settings.json

```
"python.linting.pylintArgs": [
  "--load-plugins",
  "pylint_flask_sqlalchemy, pylint_flask",
  "--init-hook",
  "import sys; sys.path.insert('/backend')"
],
"python.autoComplete.extraPaths": ["./backend"]
```

## Start dev

Feel free to modify launch dev options inside config.py  
otherwise run in terminal:  
`cd backend`  
`py app.py`

## Make migrations

Modify or create some model in models.py  
Make migrations `py manage.py db migrate`  
Apply changes to db ` py manage.py db upgrade`

## Postgres DB setup

Create config.json inside /backend with the following structure:

```{
"SECRET_KEY": "some-key",
"DATABASE_HOST": "some-host",
"DATABASE_NAME": "some-name",
"DATABASE_PORT": "some-port",
"DATABASE_USER_NAME": "some-user",
"DATABASE_USER_PASSWORD": "some-password"
}
```
