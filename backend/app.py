from flask import Flask, jsonify
from flask_cors import CORS
from routes.playlists import playlists_bp
from routes.sections import sections_bp
from data.fake_db import (
    playlists,
    tracks,
    get_playlist_by_id,
    get_tracks_for_playlist,
)


def create_app():
    app = Flask(__name__)

    # Allows requests from frontend
    CORS(app)

    app.register_blueprint(playlists_bp)
    app.register_blueprint(sections_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "message": "Flask backend is running"}), 200

    @app.route("/api/playlists", methods=["GET"])
    def get_playlists():
        return jsonify(playlists)

    @app.route("/api/playlists/<string:id>", methods=["GET"])
    def get_playlist(id):
        playlist = get_playlist_by_id(id)
        if playlist:
            return jsonify(playlist)
        return jsonify({"error": "Playlist not found"}), 404

    @app.route("/api/playlists/<string:id>/tracks", methods=["GET"])
    def get_playlist_tracks(id):
        tracks = get_tracks_for_playlist(id)
        return jsonify(tracks)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
