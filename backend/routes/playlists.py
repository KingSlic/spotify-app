from flask import Blueprint, jsonify

from db import db
from models import Playlist, Section

from data.fake_db import get_all_tracks, get_playlist_by_id, get_playlist_tracks, get_playlists_for_section, get_sections

playlists_bp = Blueprint("playlists", __name__, url_prefix="/api/playlists")


# ----------------------------------------
# GET /api/playlists
# Returns layout: sections + playlists
# ----------------------------------------

@playlists_bp.get("")
def playlists_layout():
    # Mirror the existing frontend contract: { sections: SectionWithPlaylists[] }
    show_all_href_by_section = {
        "made_for_you": "/sections/made_for_you",
    }

    sections = (
        db.session.execute(db.select(Section).order_by(Section.display_order.asc()))
        .scalars()
        .all()
    )

    out = []
    for section in sections:
        playlists = (
            db.session.execute(
                db.select(Playlist)
                .where(Playlist.section_id == section.id)
                .order_by(Playlist.created_at.desc())
            )
            .scalars()
            .all()
        )

        out.append(
            {
                "id": section.id,
                "title": section.section_title,
                "order": section.display_order,
                "showAllHref": show_all_href_by_section.get(section.id),
                "playlists": [
                    {
                        "id": pl.id,
                        "title": pl.title,
                        "subtitle": pl.subtitle,
                        # Frontend currently treats `image` as a URL string.
                        "image": pl.image_url,
                        "href": f"/playlists/{pl.id}",
                        "order": idx,
                        "sectionId": pl.section_id,
                    }
                    for idx, pl in enumerate(playlists)
                ],
            }
        )

    return jsonify({"sections": out})


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
