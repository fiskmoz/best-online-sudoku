import re
from datetime import datetime
import json
from email.utils import parseaddr

from flask import request, Blueprint
from flask.helpers import make_response, url_for
from flask.json import jsonify

from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import redirect

from .models import db, User
from .data_objects import CountryDict


bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

countries = CountryDict()


@bp.route("/register", methods=['POST'])
def register_user():
    try:
        data = json.loads(request.data.decode())
    except:
        return send_basic_response("invalid", "Invalid format or input data", 400)
    username = data["username"]
    email = data["email"]
    password = data["password"]
    country = data["country"]

    if username is None or username == "" or email is None or email == "" or password is None or password == "" or country is None or country == "":
        return send_basic_response("invalid", "Missing parameters", 400)

    valid_country = False
    for _country in countries.countries:
        if _country["name"] == country:
            valid_country = True
            continue
    if not valid_country or '@' not in parseaddr(email)[1] or len(username) > 16 or len(password) > 16:
        return send_basic_response("invalid", "Registration failed", 400)
    try:
        user_email = User.query.filter_by(email=email).first()
        user_username = User.query.filter_by(user_name=username).first()
    except:
        return send_basic_response("crash", "failed to contact database", 500)
    if user_email or user_username:
        return send_basic_response("invalid", "user already exsists", 400)

    new_user = User(user_name=username, email=email, country=country, is_admin=False,
                    registered_on=datetime.utcnow(), password=generate_password_hash(password,
                                                                                     method='sha256'))
    db.session.add(new_user)
    db.session.commit()
    auth_token = new_user.encode_auth_token(new_user.id).decode()
    response_object = {
        'status': 'success',
        'message': 'Successfully registered',
        'auth_token': auth_token,
        'username': new_user.user_name,
        'email': new_user.email,
    }
    return make_response(jsonify(response_object)), 200


@bp.route("/login", methods=['POST'])
def login_user():
    try:
        data = json.loads(request.data.decode())
    except:
        return send_basic_response("invalid", "Invalid format or input data", 400)
    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return send_basic_response("invalid", "Invalid credentials", 400)

    auth_token = user.encode_auth_token(user.id).decode()
    response_object = {
        'status': 'success',
        'message': 'Successfully logged in',
        'jwt': auth_token,
        'username': user.user_name,
        'email': user.email,
    }
    return make_response(jsonify(response_object)), 200


@bp.route("/validate", methods=['POST'])
def validate_jwt():
    try:
        data = json.loads(request.data.decode())
    except:
        return send_basic_response("invalid", "Invalid format or input data", 400)
    email = data["email"]
    jtw = data["jtw"]

    user = User.query.filter_by(email=email).first()
    response = user.decode_auth_token(jtw)
    status = response["status"]
    code = 200
    if status == "OK":
        response_object = {
            'status': 'success',
            'message': 'Successfully logged in',
            'jwt': jtw,
            'username': user.user_name,
            'email': user.email,
        }
    elif status == "EXPIRED":
        new_jwt = user.encode_auth_token(user.id)
        response_object = {
            'status': 'expired',
            'message': 'New JWT generated',
            'jwt': new_jwt,
            'username': user.user_name,
            'email': user.email,
        }
    elif status == "INVALID":
        return send_basic_response("invalid", "Please log in again", 400)
    return make_response(jsonify(response_object)), code


@bp.route("/countries", methods=['GET'])
def get_countries():
    return make_response(jsonify(countries.countries)), 200


def send_basic_response(status, message, code):
    response_object = {
        'status': status,
        'message': message
    }
    return make_response(jsonify(response_object)), code
