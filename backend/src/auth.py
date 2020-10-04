""" Contains authentication endpoints """
import json
from datetime import datetime
from email.utils import parseaddr
from flask import request, Blueprint
from flask.helpers import make_response
from flask.json import jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from .data_objects import CountryDict
from .models import DB, User

BP = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

COUNTRIES = CountryDict()


@BP.route("/register", methods=['POST'])
def register_user():
    """ Register a user, using body data"""
    try:
        data = json.loads(request.data.decode())
    except json.JSONDecodeError:
        return send_basic_response("invalid", "Invalid format or input data", 400)
    username = data["username"]
    email = data["email"]
    password = data["password"]
    country = data["country"]

    if not username.strip() or not email.stip() or not password.strip():
        return send_basic_response("invalid", "Missing parameters", 400)

    valid_country = False
    for _country in COUNTRIES.countries:
        if _country["name"] == country:
            valid_country = True
            continue
    if not valid_country or '@' not in parseaddr(email)[1] or len(username) > 16 or len(password) > 16:
        return send_basic_response("invalid", "Registration failed", 400)
    try:
        user_email = User.query.filter_by(email=email).first()
        user_username = User.query.filter_by(user_name=username).first()
    except Exception:  # pylint: disable=broad-except
        return send_basic_response("crash", "failed to contact database", 500)
    if user_email or user_username:
        return send_basic_response("invalid", "user already exsists", 400)

    new_user = User(user_name=username, email=email, country=country, is_admin=False, login_count=0,
                    registered_on=datetime.utcnow(), password=generate_password_hash(password,
                                                                                     method='sha256'))
    DB.session.add(new_user)
    DB.session.commit()
    auth_token = new_user.encode_auth_token(new_user.id).decode()
    response_object = {
        'status': 'success',
        'message': 'Successfully registered',
        'auth_token': auth_token,
        'username': new_user.user_name,
        'email': new_user.email,
    }
    return make_response(jsonify(response_object)), 200


@BP.route("/login", methods=['POST'])
def login_user():
    """ Login a user, using body data"""
    try:
        data = json.loads(request.data.decode())
    except json.JSONDecodeError:
        return send_basic_response("invalid", "Invalid format or input data", 400)
    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()
    user.login_count += 1
    DB.session.commit()

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


@BP.route("/validate", methods=['POST'])
def validate_jwt():
    """ validate token  """
    try:
        data = json.loads(request.data.decode())
    except json.JSONDecodeError:
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


@BP.route("/countries", methods=['GET'])
def get_countries():
    """ Return list of countries """
    return make_response(jsonify(COUNTRIES.countries)), 200


def send_basic_response(status, message, code):
    """ see function name """
    response_object = {
        'status': status,
        'message': message
    }
    return make_response(jsonify(response_object)), code
