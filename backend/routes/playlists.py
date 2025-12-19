# backend/routes/playlists.py

from flask import Blueprint, jsonify, request
from data.fake_db import (
    playlists,
    get_playlist_by_id,
    get_tracks_for_playlist,
    update_playlist,
    delete_playlist,
    validate_playlist_updates,
    get_playlists_grouped_by_section,

)

playlists_bp = Blueprint("playlists", __name__, url_prefix="/api/playlists")


@playlists_bp.route("", methods=["GET"])
def get_playlists():
    return jsonify(get_playlists_grouped_by_section())



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


@playlists_bp.route("/api/playlists", methods=["POST"])
def create_playlist():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    title = data.get("title")
    playlist_type = data.get("type")

    if not title or not playlist_type:
        return jsonify({"error": "Missing title or type"}), 400

    new_id = str(len(playlists) + 1)

    playlist = {
        "id": new_id,
        "title": title,
        "subtitle": data.get("subtitle", ""),
        "type": playlist_type,
        "image": data.get("image", "https://picsum.photos/300"),
        "creator": data.get("creator", "You"),
        "trackIds": [],
    }

    playlists.append(playlist)

    return (
        jsonify({"message": "Playlist created successfully", "playlist": playlist}),
        201,
    )


@playlists_bp.route("/api/playlists/<playlist_id>", methods=["PATCH"])
def update_playlist_route(playlist_id):

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    validation_error = validate_playlist_updates(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    updated = update_playlist(playlist_id, data)
    if not updated:
        return jsonify({"error": "Playlist not found"}), 404

    return jsonify(updated), 200


@playlists_bp.route("/api/playlists/<playlist_id>/reorder", methods=["PATCH"])
def reorder_playlist_route(playlist_id):
    data = request.get_json()
    if not data or "order" not in data:
        return jsonify({"error": "New order is required"}), 400

    updated, error = reorder_playlist(playlist_id, data["order"])
    if error:
        return jsonify({"error": error}), 400

    return jsonify(updated), 200


@playlists_bp.route("/api/playlists/<playlist_id>", methods=["DELETE"])
def delete_playlist_route(playlist_id):
    deleted = delete_playlist(playlist_id)
    if not deleted:
        return jsonify({"error": "Playlist not found"}), 404

    return jsonify({"message": "Playlist deleted successfully"}), 200


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
