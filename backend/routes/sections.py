from flask import Blueprint, jsonify
from data.fake_db import get_sections

sections_bp = Blueprint('sections', __name__, url_prefix="/api/sections")

@sections_bp.route("", methods=['GET'])
def get_all_sections():
    return jsonify(get_sections())


