from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import relationship

from db import db


def _utcnow():
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(String(64), primary_key=True)
    username = db.Column(String(255), nullable=False)
    email = db.Column(String(255), nullable=False)
    password = db.Column(String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=_utcnow)

    playlists_created = relationship("Playlist", back_populates="creator", lazy="selectin")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Section(db.Model):
    __tablename__ = "sections"

    id = db.Column(String(64), primary_key=True)
    section_title = db.Column(String(255), nullable=False)
    display_order = db.Column(db.Integer, nullable=False)

    playlists = relationship("Playlist", back_populates="section", lazy="selectin")

    def to_dict(self):
        # Matches the current API payload shape from `fake_db.py`
        return {
            "id": self.id,
            "title": self.section_title,
            "order": self.display_order,
        }


class Playlist(db.Model):
    __tablename__ = "playlists"

    id = db.Column(String(64), primary_key=True)

    section_id = db.Column(String(64), ForeignKey("sections.id"), nullable=False)
    title = db.Column(String(255), nullable=False)
    subtitle = db.Column(String(255), nullable=True)

    # Schema had VARCHAR(255) here, but that won't match `users.id` (VARCHAR(64)).
    # Using 64 keeps IDs consistent and supports a real FK.
    user_creator_id = db.Column(String(64), ForeignKey("users.id"), nullable=False)

    image_url = db.Column(String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=_utcnow)

    section = relationship("Section", back_populates="playlists")
    creator = relationship("User", back_populates="playlists_created")

    playlist_tracks = relationship(
        "PlaylistTrack",
        back_populates="playlist",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def to_dict(self):
        # Matches the current API payload shape from `fake_db.py`
        return {
            "id": self.id,
            "sectionId": self.section_id,
            "title": self.title,
            "subtitle": self.subtitle,
            "createdAt": int(self.created_at.timestamp()) if self.created_at else None,
            "image": {"kind": "url", "url": self.image_url},
            "type": "playlist",
            "creator": self.creator.username if self.creator else None,
            "href": f"/playlists/{self.id}",
        }


class Track(db.Model):
    __tablename__ = "tracks"

    id = db.Column(String(64), primary_key=True)
    title = db.Column(String(255), nullable=False)
    artist_name = db.Column(String(255), nullable=False)
    album_name = db.Column(String(255), nullable=False)

    # Schema called this VARCHAR(255). Brutally: that’s a bad type for seconds.
    # Keeping it as Integer aligns with the column name and typical usage.
    duration_in_seconds = db.Column(db.Integer, nullable=False)

    image_url = db.Column(String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=_utcnow)

    playlist_tracks = relationship("PlaylistTrack", back_populates="track", lazy="selectin")

    def to_dict(self):
        # Matches the current API payload shape from `fake_db.py`
        seconds = self.duration_in_seconds or 0
        mm = seconds // 60
        ss = seconds % 60
        return {
            "id": self.id,
            "title": self.title,
            "artists": [self.artist_name],
            "album": self.album_name,
            "duration": f"{mm}:{ss:02d}",
            "image": self.image_url,
        }


class PlaylistTrack(db.Model):
    """Association object for Playlist↔Track with metadata (added_at)."""

    __tablename__ = "playlist_tracks"

    playlist_id = db.Column(String(64), ForeignKey("playlists.id"), primary_key=True)
    track_id = db.Column(String(64), ForeignKey("tracks.id"), primary_key=True)
    added_at = db.Column(db.DateTime(timezone=True), nullable=False, default=_utcnow)

    playlist = relationship("Playlist", back_populates="playlist_tracks")
    track = relationship("Track", back_populates="playlist_tracks")

    def to_dict(self):
        return {
            "playlistId": self.playlist_id,
            "trackId": self.track_id,
            "addedAt": int(self.added_at.timestamp()) if self.added_at else None,
        }