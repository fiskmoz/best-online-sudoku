from flask import request, Blueprint, Response
from .models import db, User
import re
import datetime
from flask.helpers import make_response, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import redirect
from .data_objects import CountryDict
from email.utils import parseaddr
from flask.json import jsonify

bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

countries = CountryDict()


@bp.route("/register", methods=['POST'])
def register_user():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    country = request.form.get('country')

    if not country in countries or '@' not in parseaddr(email)[1]:
        return Response(
            response="Registration failed",
            status=400,
            mimetype='application/text'
        )
    user = User.query.filter_by(email=email).first()

    if user:
        return redirect(url_for('auth.login_user'))

    new_user = User(user_name=username, email=email, country=country, is_admin=False, registered_on=datetime.utcnow(),
                    password=generate_password_hash(password, method='sha256'), )

    db.session.add(new_user)
    db.session.commit()
    auth_token = user.encode_auth_token(user.id).decode()
    response_object = {
        'status': 'success',
        'message': 'Successfully registered',
        'auth_token': auth_token
    }
    return make_response(jsonify(response_object)), 200


@bp.route("/login", methods=['POST'])
def login_user():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return redirect(url_for('auth.login'))

    auth_token = user.encode_auth_token(user.id).decode()
    response_object = {
        'status': 'success',
        'message': 'Successfully logged in',
        'auth_token': auth_token
    }
    return make_response(jsonify(response_object)), 200
