from flask import request, Blueprint, Response
from ..models.user import db, User
import re
from flask.helpers import url_for
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import redirect
from ..models.country_dict import CountryDict
from email.utils import parseaddr

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

    new_user = User(user_name=username, email=email, country=country,
                    password=generate_password_hash(password, method='sha256'))

    db.session.add(new_user)
    db.session.commit()

    return Response(
        response="Registration successfull! =)",
        status=200,
        mimetype='application/text'
    )


@bp.route("/login", methods=['POST'])
def login_user():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return redirect(url_for('auth.login'))

    return Response(
        response="Login successfull! =)",
        status=200,
        mimetype='application/text'
    )
