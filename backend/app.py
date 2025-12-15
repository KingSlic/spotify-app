from flask import Flask, jsonify
from flask_cors import CORS
from routes.playlists import playlists_bp

def create_app():
  app = Flask(__name__)

  #Allows requests from frontend
  CORS(app)

  app.register_blueprint(playlists_bp)

  @app.route("/api/health", methods=["GET"])
  def health_check():
    return jsonify({
      "status": "ok",
      "message": "Flask backend is running"
    }), 200

  return app

app = create_app()

if __name__ == "__main__":
  app.run(debug=True, port=5000)
