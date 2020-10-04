"""Base application, run this to start the backend."""
import os
from flask import Flask
from jinja2.utils import import_string
from src import auth, generate_sudoku, static
from src.models import db

APP = Flask(__name__)
try:
    if os.environ['ENV'] == 'prod':
        APP.config.from_object(import_string('config.ProductionConfig'))
    elif os.environ['ENV'] == "test":
        APP.config.from_object(import_string('config.TestingConfig'))
    elif os.environ['ENV'] == "staging":
        APP.config.from_object(import_string('config.StagingConfig'))
    else:
        APP.config.from_object(import_string('config.DevelopmentConfig'))
except KeyError:
    APP.config.from_object(import_string('config.DevelopmentConfig'))


APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

APP.register_blueprint(auth.bp)

APP.register_blueprint(generate_sudoku.bp)

APP.register_blueprint(static.bp)

db.init_app(APP)

if __name__ == '__main__':
    APP.run()
