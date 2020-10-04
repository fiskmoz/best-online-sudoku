"""Holds endpoints for serving of static files."""
import mimetypes

from flask import Blueprint
from flask.helpers import send_from_directory

BP = Blueprint('static', __name__, url_prefix='/')
mimetypes.init()


@BP.route('static/js/<path:path>', methods=['GET'])
def serve_static_js(path):
    """Serve static js files."""
    return send_from_directory("build/static/js", path, mimetype=mimetypes.guess_type(path)[0])


@BP.route('static/css/<path:path>', methods=['GET'])
def serve_static_css(path):
    """Serve static css files."""
    return send_from_directory("build/static/css", path, mimetype=mimetypes.guess_type(path)[0])


@BP.route('static/media/<path:path>', methods=['GET'])
def serve_static_media(path):
    """Serve static media files."""
    return send_from_directory("build/static/media", path, mimetype=mimetypes.guess_type(path)[0])


@BP.route('/', defaults={'path': ''}, methods=['GET'])
@BP.route('/<path:path>', methods=['GET'])
def serve_static(path):
    """Serve index.html."""
    if path == "":
        return send_from_directory("build/", "index.html")
    return send_from_directory("build/", path, mimetype=mimetypes.guess_type(path)[0])
