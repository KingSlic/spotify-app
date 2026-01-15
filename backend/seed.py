import argparse
import os
import random
from datetime import datetime, timedelta, timezone

from flask import Flask

from db import db, init_db
from models import Playlist, PlaylistTrack, Section, Track, User


def utcnow():
    return datetime.now(timezone.utc)


def parse_mmss_to_seconds(mmss: str) -> int:
    try:
        mm, ss = mmss.split(":")
        return int(mm) * 60 + int(ss)
    except Exception:
        return 0


def build_app(database_uri: str | None) -> Flask:
    app = Flask(__name__)
    if database_uri:
        app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    init_db(app)
    return app


def seed(db_uri: str | None, reset: bool, playlists_per_section: int, tracks_count: int) -> None:
    app = build_app(db_uri)

    with app.app_context():
        if reset:
            db.drop_all()
            db.create_all()
        else:
            # Avoid blowing up with IntegrityError on re-run.
            already_seeded = db.session.query(User.id).first() is not None
            if already_seeded:
                print("Database already has data. Re-run with --reset to reseed.")
                return
            db.create_all()

        # ----------------------------
        # Users
        # ----------------------------
        spotify_user = User(
            id="u-spotify",
            username="Spotify",
            email="spotify@example.com",
            password="password",
            created_at=utcnow(),
        )
        demo_user = User(
            id="u-demo",
            username="demo",
            email="demo@example.com",
            password="password",
            created_at=utcnow(),
        )
        db.session.add_all([spotify_user, demo_user])

        # ----------------------------
        # Sections (use same IDs as fake_db)
        # ----------------------------
        sections_seed = [
            ("recently_played", "Recently Played", 0),
            ("made_for_you", "Made for You", 1),
            ("your_weekly_vibe", "Your Weekly Vibe", 2),
            ("chill_mode_engaged", "Chill Mode Engaged", 3),
        ]
        sections: list[Section] = []
        for sid, title, order in sections_seed:
            sections.append(Section(id=sid, section_title=title, display_order=order))
        db.session.add_all(sections)

        # ----------------------------
        # Tracks (global pool)
        # ----------------------------
        tracks: list[Track] = []
        for i in range(tracks_count):
            tid = f"t-{i}"
            artist = f"Artist {i % 5}"
            album = f"Album {i % 3}"
            duration_mmss = f"{random.randint(2, 4)}:{random.randint(0, 59):02d}"
            tracks.append(
                Track(
                    id=tid,
                    title=f"Track {i}",
                    artist_name=artist,
                    album_name=album,
                    duration_in_seconds=parse_mmss_to_seconds(duration_mmss),
                    image_url=f"https://picsum.photos/seed/track-{i}/300",
                    created_at=utcnow() - timedelta(days=random.randint(0, 30)),
                )
            )
        db.session.add_all(tracks)

        # For deterministic sampling per playlist id
        track_ids = [t.id for t in tracks]

        # ----------------------------
        # Playlists + playlist_tracks
        # ----------------------------
        playlist_rows: list[Playlist] = []
        join_rows: list[PlaylistTrack] = []

        for section in sections:
            for i in range(playlists_per_section):
                playlist_id = f"pl-{section.id}-{i}"

                rng = random.Random(playlist_id)
                created_at = utcnow() - timedelta(days=rng.randint(0, 7))

                playlist_rows.append(
                    Playlist(
                        id=playlist_id,
                        section_id=section.id,
                        title=f"{section.section_title} Playlist {i + 1}",
                        subtitle="Based on your activity",
                        user_creator_id=spotify_user.id,
                        image_url=f"https://picsum.photos/seed/playlist-{playlist_id}/300",
                        created_at=created_at,
                    )
                )

                # choose tracks + added_at metadata
                size = min(20, len(track_ids))
                chosen = rng.sample(track_ids, size)
                for tid in chosen:
                    added_at = utcnow() - timedelta(days=rng.randint(0, 30), seconds=rng.randint(0, 86400))
                    join_rows.append(
                        PlaylistTrack(
                            playlist_id=playlist_id,
                            track_id=tid,
                            added_at=added_at,
                        )
                    )

        db.session.add_all(playlist_rows)
        db.session.add_all(join_rows)
        db.session.commit()

        print(
            f"Seeded: {len(sections)} sections, {len(tracks)} tracks, "
            f"{len(playlist_rows)} playlists, {len(join_rows)} playlist_tracks"
        )


def main():
    parser = argparse.ArgumentParser(description="Seed the database with dummy data.")
    parser.add_argument(
        "--db",
        dest="db_uri",
        default=None,
        help="Override database URI (otherwise uses DATABASE_URL or sqlite:///app.db).",
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Drop all tables and recreate before seeding.",
    )
    parser.add_argument("--playlists-per-section", type=int, default=6)
    parser.add_argument("--tracks", type=int, default=60)

    args = parser.parse_args()
    seed(
        db_uri=args.db_uri or os.getenv("DATABASE_URL"),
        reset=args.reset,
        playlists_per_section=max(0, args.playlists_per_section),
        tracks_count=max(0, args.tracks),
    )


if __name__ == "__main__":
    main()

