# backend/routes/playlists.py

from flask import Blueprint, jsonify, request
from data.fake_db import (
    get_playlist_by_id,
    get_tracks_for_playlist,
    create_playlist,
    update_playlist,
    delete_playlist,
    get_playlists_layout,
)

playlists_bp = Blueprint("playlists", __name__, url_prefix="/api/playlists")


# =====================================================
# GET /api/playlists
# Layout endpoint (authoritative)
# =====================================================


@playlists_bp.route("", methods=["GET"])
def get_playlists():
    """
    Returns layout-ready data owned entirely by the backend.

    The frontend MUST NOT:
    - group playlists
    - sort playlists
    - sort sections
    - infer layout rules

    This endpoint defines the UI structure.
    """

    return jsonify({"sections": get_playlists_layout()})


# =====================================================
# GET /api/playlists/<id>
# Single playlist
# =====================================================


@playlists_bp.route("/<playlist_id>", methods=["GET"])
def get_playlist(playlist_id):
    playlist = get_playlist_by_id(playlist_id)

    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    return jsonify(playlist)


# =====================================================
# GET /api/playlists/<id>/tracks
# Playlist tracks
# =====================================================


@playlists_bp.route("/<playlist_id>/tracks", methods=["GET"])
def get_playlist_tracks(playlist_id):

    playlist = get_playlist_by_id(playlist_id)

    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404
    tracks = get_tracks_for_playlist(playlist_id)

    return jsonify(tracks)


# =====================================================
# POST /api/playlists
# Create playlist
# =====================================================


@playlists_bp.route("", methods=["POST"])
def post_playlist():
    """
    Creates a playlist.

    All validation (required fields, section existence,
    order conflicts) lives in fake_db.py.
    """

    try:
        playlist = create_playlist(request.json)
        return jsonify(playlist), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# =====================================================
# PATCH /api/playlists/<id>
# Partial update (including section/order changes)
# =====================================================


@playlists_bp.route("/<playlist_id>", methods=["PATCH"])
def patch_playlist(playlist_id):
    """
    Updates a playlist.

    Supports partial updates.
    Section/order validation is enforced centrally.
    """

    try:
        playlist = update_playlist(playlist_id, request.json)
        return jsonify(playlist)

    except KeyError:
        return jsonify({"error": "Playlist not found"}), 404

    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# =====================================================
# DELETE /api/playlists/<id>
# =====================================================


@playlists_bp.route("/<playlist_id>", methods=["DELETE"])
def remove_playlist(playlist_id):
    """
    Hard-deletes a playlist.

    - Returns 204 on success
    - Does not return a body
    - Does not cascade to tracks or history
    """
    try:
        delete_playlist(playlist_id)
        return "", 204

    except KeyError:
        return jsonify({"error": "Playlist not found"}), 404


# explain intent-based routes, their functionality and use cases


# Intent-based routes are designed to handle specific user intents or actions related to
# playlists. Here's a breakdown of each route and its functionality:


# #1. **Get Playlists (`/api/playlists`)**:
#    - **Functionality**: Returns a list of all playlists, grouped by their section.
#    **Use Cases**: Useful for displaying a list of playlists to the user, such as in a
#    homepage or a playlist browser. This route is useful for users who want to explore
#    different types of playlists, such as "Popular", "New Releases", or "Featured".

# 2. **Get Playlist (`/api/playlists/<playlist_id>`)**:
#   - **Functionality**: Returns the details of a specific playlist by its ID.
#   - **Use Cases**: Useful for displaying the details of a single playlist, such as
#   when a user clicks on a playlist in the browser.
#   This route is useful for users who want to view the title, subtitle, type, image,
#   creator, and track IDs of a specific playlist.


# 3. **Get Playlist Tracks (`/api/playlists/<playlist_id>/tracks`)**:
#  - **Functionality**: Returns a list of tracks associated with a specific playlist
#    by its ID.
#   - **Use Cases**: Useful for displaying the list of tracks in a playlist, such as
#   when a user wants to view the songs in a particular playlist. This route is useful for
#   users who want to see the track details, such as title, artist, and duration.


# 4. **Create Playlist (`/api/playlists`)**:
#   - **Functionality**: Creates a new playlist with the provided data.
#   - **Use Cases**: Useful for allowing users to create their own playlists, such as
#   when a user wants to create a new playlist with a specific title and type.
#   This route is useful for users who want to organize their favorite songs into
#   a new playlist.


# 5. **Update Playlist (`/api/playlists/<playlist_id>`)**:
#   - **Functionality**: Updates the details of a specific playlist by its ID with the
#   provided data.
#   - **Use Cases**: Useful for allowing users to update the details of an existing
#   playlist, such as when a user wants to change the title or add more tracks.
#   This route is useful for users who want to modify the playlist's title, subtitle,
#   type, image, or creator information.


# 6. **Reorder Playlist (`/api/playlists/<playlist_id>/reorder`)**:
#   - **Functionality**: Reorders the tracks in a specific playlist by its ID according to
#   the provided new order.
#   - **Use Cases**: Useful for allowing users to rearrange the tracks in a playlist,
#   such as when a user wants to change the order of tracks based on their preference.
#   This route is useful for users who want to customize the track order in a playlist.


# 7. **Delete Playlist (`/api/playlists/<playlist_id>`)**:
#  - **Functionality**: Deletes a specific playlist by its ID.

#  - **Use Cases**: Useful for allowing users to delete an existing playlist, such as
#    when a user wants to remove a playlist they no longer need or want.
#    This route is useful for users who want to clean up their playlist library.
#    remove playlists that are no longer relevant to them.
