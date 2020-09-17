from flask import request, Blueprint, Response
import json
import mimetypes
from flask.helpers import send_from_directory

bp = Blueprint('static', __name__, url_prefix='/')
mimetypes.init()


@bp.route('static/js/<path:path>', methods=['GET'])
def serve_static_js(path):
    return send_from_directory("build/static/js", path, mimetype=mimetypes.guess_type(path)[0])


@bp.route('static/css/<path:path>', methods=['GET'])
def serve_static_css(path):
    print(path)
    return send_from_directory("build/static/css", path, mimetype=mimetypes.guess_type(path)[0])


@bp.route('static/media/<path:path>', methods=['GET'])
def serve_static_media(path):
    print(path)
    return send_from_directory("build/static/media", path, mimetype=mimetypes.guess_type(path)[0])


@bp.route('/', defaults={'path': ''}, methods=['GET'])
@bp.route('/<path:path>', methods=['GET'])
def serve_static(path):
    print(path)
    if path == "":
        return send_from_directory("build/", "index.html")
    return send_from_directory("build/", path, mimetype=mimetypes.guess_type(path)[0])
