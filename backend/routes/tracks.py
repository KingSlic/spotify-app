from flask import Blueprint, jsonify
from data.fake_db import get_all_tracks

tracks_bp = Blueprint("tracks", __name__, url_prefix="/api/tracks")

@tracks_bp.route("", methods=["GET"])
def list_tracks():
    try:
        tracks = get_all_tracks()
        return jsonify(tracks)
    except Exception as e:
        print("TRACKS ROUTE ERROR:", e)
        return jsonify({"error": "failed to load tracks"}), 500
