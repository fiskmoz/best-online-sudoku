from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    # primary keys are required by SQLAlchemy
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(1000))
    email = db.Column(db.String(100), unique=True)
    country = db.Column(db.String(1000))
    password = db.Column(db.String(100))
