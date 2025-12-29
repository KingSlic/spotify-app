from flask import Blueprint, jsonify
from data.fake_db import tracks

tracks_bp = Blueprint("tracks", __name__, url_prefix="/api/tracks")

@tracks_bp.route("", methods=["GET"])
def get_all_tracks():
    return jsonify(tracks)
