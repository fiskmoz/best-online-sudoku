import os
import json

basedir = os.path.abspath(os.path.dirname(__file__))

if os.path.isfile("./config.json"):
    with open("./config.json", "r") as config_file:
        cred_dict = json.load(config_file)


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed'


class ProductionConfig(Config):
    DEBUG = False
    try:
        SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
        DATABASE_HOST = os.environ['DATABASE_HOST']
        DATABASE_NAME = os.environ['DATABASE_NAME']
        DATABASE_PORT = os.environ['DATABASE_PORT']
        DATABASE_USER_NAME = os.environ['DATABASE_USER_NAME']
        DATABASE_USER_PASSWORD = os.environ['DATABASE_USER_PASSWORD']
    except KeyError:
        pass


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = cred_dict['DATABASE_URL']
    DATABASE_HOST = cred_dict['DATABASE_HOST']
    DATABASE_NAME = cred_dict['DATABASE_NAME']
    DATABASE_PORT = cred_dict['DATABASE_PORT']
    DATABASE_USER_NAME = cred_dict['DATABASE_USER_NAME']
    DATABASE_USER_PASSWORD = cred_dict['DATABASE_USER_PASSWORD']


class TestingConfig(Config):
    TESTING = True
