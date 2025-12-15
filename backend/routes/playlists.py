# backend/routes/playlists.py

from flask import Blueprint, jsonify
from data.fake_db import playlists, get_playlist_by_id, get_tracks_for_playlist

playlists_bp = Blueprint("playlists", __name__, url_prefix="/api/playlists")


@playlists_bp.route("", methods=["GET"])
def get_playlists():
    return jsonify(playlists)


@playlists_bp.route("/<playlist_id>", methods=["GET"])
def get_playlist(playlist_id):
    playlist = get_playlist_by_id(playlist_id)
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404
    return jsonify(playlist)


@playlists_bp.route("/<playlist_id>/tracks", methods=["GET"])
def get_playlist_tracks(playlist_id):
    tracks = get_tracks_for_playlist(playlist_id)
    return jsonify(tracks)
