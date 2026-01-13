from flask import Blueprint, jsonify
from data.fake_db import (
    get_sections,
    get_playlists_for_section,
    get_playlist_by_id,
    get_playlist_tracks,
    get_all_tracks,
)

playlists_bp = Blueprint("playlists", __name__, url_prefix="/api/playlists")


# ----------------------------------------
# GET /api/playlists
# Returns layout: sections + playlists
# ----------------------------------------

@playlists_bp.get("")
def playlists_layout():
    sections = get_sections()  # already sorted, authoritative
    out = []

    for section in sections:
        playlists = get_playlists_for_section(section["id"])

        out.append(
            {
                **section,
                "playlists": playlists,
            }
        )

    return jsonify({ "sections": out })


# ----------------------------------------
# GET /api/playlists/<id>
# Returns single playlist (no tracks)
# ----------------------------------------

@playlists_bp.get("/<playlist_id>")
def get_playlist(playlist_id):
    playlist = get_playlist_by_id(playlist_id)
    if not playlist:
        return jsonify({ "error": "Not found" }), 404

    return jsonify({ "playlist": playlist })


# ----------------------------------------
# GET /api/playlists/<id>/tracks
# Returns joined track metadata
# ----------------------------------------

@playlists_bp.get("/<playlist_id>/tracks")
def get_playlist_tracks_route(playlist_id):
    joins = get_playlist_tracks(playlist_id)
    if not joins:
        return jsonify({ "tracks": [] })

    all_tracks = { t["id"]: t for t in get_all_tracks() }

    merged = [
        {
            **all_tracks[j["id"]],
            "addedAt": j["addedAt"],
        }
        for j in joins
        if j["id"] in all_tracks
    ]

    return jsonify({
        "playlistId": playlist_id,
        "tracks": merged
    })
