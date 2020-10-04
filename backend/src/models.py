"""All DB models and accompaning functions"""
import datetime
import jwt

from flask_sqlalchemy import SQLAlchemy
from flask import current_app
from sqlalchemy.types import Boolean

DB = SQLAlchemy()


class User(DB.Model):
    """User model, 1 for every user"""
    id = DB.Column(DB.Integer, primary_key=True)
    user_name = DB.Column(DB.String(1000))
    email = DB.Column(DB.String(100), unique=True)
    country = DB.Column(DB.String(1000))
    password = DB.Column(DB.String(100))
    is_admin = DB.Column(Boolean, unique=False, default=True)
    registered_on = DB.Column(DB.DateTime)
    login_count = DB.Column(DB.Integer)

    @staticmethod
    def encode_auth_token(user_id):
        """Create and returns an jwt with 60 minutes of valid time"""
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=60*60),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except jwt.exceptions.InvalidKeyError as exception:
            return exception

    @staticmethod
    def decode_auth_token(auth_token):
        """Decode a authentication token and return valid or invalid response"""
        try:
            payload = jwt.decode(
                auth_token, current_app.config.get('SECRET_KEY'))
            return {"payload": payload['sub'], "status": "OK"}
        except jwt.ExpiredSignatureError:
            return {"payload": 'Signature expired. Please log in again.', "status": "EXPIRED"}
        except jwt.InvalidTokenError:
            return {"payload": 'Invalid token. Please log in again.', "status": "INVALID"}


class Score(DB.Model):
    """1 entry represents a ranked attempt, a user can have many scores"""
    id = DB.Column(DB.Integer, primary_key=True)
    user_id = DB.Column(DB.Integer, DB.ForeignKey('user.id'),
                        nullable=False)
    start_time = DB.Column(DB.DateTime)
    end_time = DB.Column(DB.DateTime)
    board_data_json = DB.Column(DB.String(500))

    @staticmethod
    def encode_score_token(board_id):
        """Create and returns an jwt with board_id with 60 minutes of valid time"""
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=60*60),
                'iat': datetime.datetime.utcnow(),
                'sub': board_id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except jwt.exceptions.InvalidKeyError as exception:
            return exception

    @staticmethod
    def decode_score_token(score_token):
        """Decode a score token and return valid or invalid response"""
        try:
            payload = jwt.decode(
                score_token, current_app.config.get('SECRET_KEY'))
            return {"payload": payload['sub'], "status": "OK"}
        except jwt.ExpiredSignatureError:
            return {"payload": 'Signature expired. Please log in again.', "status": "EXPIRED"}
        except jwt.InvalidTokenError:
            return {"payload": 'Invalid token. Please log in again.', "status": "INVALID"}
