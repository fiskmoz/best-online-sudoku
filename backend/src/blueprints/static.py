from flask import request, Blueprint, Response
import json
import mimetypes
from flask.helpers import send_from_directory

bp = Blueprint('static', __name__, url_prefix='/')
mimetypes.init()


@bp.route("/", methods=['GET'])
def get_sudoku():
    def index():
        return send_from_directory("./static/", "index.html")


@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def serve_static(path):
    return send_from_directory("./static/", path, mimetype=mimetypes.guess_type(path)[0])
