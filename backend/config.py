"""Holds different configuration classes which can be dynamically loaded from startup."""
import os
import json

BASEDIR = os.path.abspath(os.path.dirname(__file__))

if os.path.isfile("./config.json"):
    with open("./config.json", "r") as config_file:
        CRED_DICT = json.load(config_file)


class Config():  # pylint: disable=too-few-public-methods
    """Base configuration class."""
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed'


class ProductionConfig(Config):  # pylint: disable=too-few-public-methods
    """Production configuration, extends base Config"""
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


class StagingConfig(Config):  # pylint: disable=too-few-public-methods
    """Staging configuration, extends base Config, not currently used"""
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):  # pylint: disable=too-few-public-methods
    """Development configuration, extends base Config"""
    DEVELOPMENT = True
    DEBUG = True
    try:
        SQLALCHEMY_DATABASE_URI = CRED_DICT['DATABASE_URL']
        DATABASE_HOST = CRED_DICT['DATABASE_HOST']
        DATABASE_NAME = CRED_DICT['DATABASE_NAME']
        DATABASE_PORT = CRED_DICT['DATABASE_PORT']
        DATABASE_USER_NAME = CRED_DICT['DATABASE_USER_NAME']
        DATABASE_USER_PASSWORD = CRED_DICT['DATABASE_USER_PASSWORD']
    except NameError:
        pass


class TestingConfig(Config):  # pylint: disable=too-few-public-methods
    """Testing configuration, extends base Config, not currently used"""
    TESTING = True
