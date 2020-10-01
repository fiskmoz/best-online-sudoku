from flask_sqlalchemy import SQLAlchemy
import jwt
import datetime
from flask import current_app
from sqlalchemy.types import Boolean, Date

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(1000))
    email = db.Column(db.String(100), unique=True)
    country = db.Column(db.String(1000))
    password = db.Column(db.String(100))
    is_admin = db.Column(Boolean, unique=False, default=True)
    registered_on = db.Column(db.DateTime)
    login_count = db.Column(db.Integer)

    def encode_auth_token(self, user_id):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=60*30),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(
                auth_token, current_app.config.get('SECRET_KEY'))
            return {"payload": payload['sub'], "status": "OK"}
        except jwt.ExpiredSignatureError:
            return {"payload": 'Signature expired. Please log in again.', "status": "EXPIRED"}
        except jwt.InvalidTokenError:
            return {"payload": 'Invalid token. Please log in again.', "status": "INVALID"}


class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    board_data_json = db.Column(db.String(500))

    def encode_score_token(self, id):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=60*60),
                'iat': datetime.datetime.utcnow(),
                'sub': id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_score_token(score_token):
        try:
            payload = jwt.decode(
                score_token, current_app.config.get('SECRET_KEY'))
            return {"payload": payload['sub'], "status": "OK"}
        except jwt.ExpiredSignatureError:
            return {"payload": 'Signature expired. Please log in again.', "status": "EXPIRED"}
        except jwt.InvalidTokenError:
            return {"payload": 'Invalid token. Please log in again.', "status": "INVALID"}
