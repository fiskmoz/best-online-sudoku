""" Contains scoreboard endpoints """
import json
from flask import request, Blueprint
from flask.helpers import make_response
from flask.json import jsonify

from .data_objects import CountryDict
from .models import DB, User, Score
from sqlalchemy.orm.strategy_options import lazyload

BP = Blueprint('scoreboard', __name__, url_prefix='/api/v1/scoreboard')

COUNTRIES = CountryDict()


@BP.route("/scores", methods=['GET'])
def register_user():
    """ Get score for all users, this can be done faster. """
    scores = DB.session.query(
        Score.start_time, Score.end_time, User.user_name, User.country).filter(Score.end_time != None).all()
    response_object = {
        'scores': [{"starttime": score[0], "endtime": score[1], "username": score[2], "country": score[3]} for score in scores]
    }
    return make_response(jsonify(response_object)), 200
