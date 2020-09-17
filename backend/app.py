from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import os
from jinja2.utils import import_string
from src.blueprints import auth, generate_sudoku
from src.models.user import db
from backend.src.blueprints import static

app = Flask(__name__)
try:
    if os.environ['ENV'] == 'prod':
        app.config.from_object(import_string('config.ProductionConfig'))
    elif os.environ['ENV'] == "test":
        app.config.from_object(import_string('config.TestingConfig'))
    elif os.environ['ENV'] == "staging":
        app.config.import_string(import_string('config.StagingConfig'))
    else:
        app.config.import_string(import_string('config.DevelopmentConfig'))
except KeyError:
    app.config.from_object(import_string('config.DevelopmentConfig'))


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.register_blueprint(auth.bp)

app.register_blueprint(generate_sudoku.bp)

app.register_blueprint(static.bp)

db.init_app(app)

if __name__ == '__main__':
    app.run()
