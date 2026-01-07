# backend/data/fake_db.py

import random
import uuid

# -----------------------------
# Section Data (Authoritative)
# -----------------------------

SECTIONS = [
    {
        "id": "recently_played",
        "title": "Recently Played",
        "order": 0,
        "showAllHref": None,
    },
    {
        "id": "made_for_gerry",
        "title": "Made for Gerry",
        "order": 1,
        "showAllHref": "/sections/made_for_gerry",
    },
    {
        "id": "your_weekly_vibe",
        "title": "Your Weekly Vibe",
        "order": 2,
        "showAllHref": None,
    },
    {
        "id": "chill_mode_engaged",
        "title": "Chill Mode Engaged",
        "order": 3,
        "showAllHref": None,
    },
]

# -----------------------------
# Track Data (Global Pool)
# -----------------------------

tracks = [
    {
        "id": "t1",
        "title": "Blinding Lights",
        "artists": ["The Weeknd"],
        "album": "After Hours",
        "duration": "3:20",
    },
    {
        "id": "t2",
        "title": "Save Your Tears",
        "artists": ["The Weeknd"],
        "album": "After Hours",
        "duration": "3:36",
    },
    {
        "id": "t3",
        "title": "Passionfruit",
        "artists": ["Drake"],
        "album": "More Life",
        "duration": "4:18",
    },
    {
        "id": "t4",
        "title": "Nights",
        "artists": ["Frank Ocean"],
        "album": "Blonde",
        "duration": "5:07",
    },
]

# 🟨 FIX: deterministic playlist track generation (must live here)
def generate_playlist_tracks(seed, size=20):
    random.seed(seed)
    return [t["id"] for t in random.sample(tracks, min(size, len(tracks)))]

# -----------------------------
# Playlist Generation (NEW)
# -----------------------------

# 🟨 FIX: centralized playlist factory (replaces hardcoded playlists list)
def generate_playlists_for_section(section_id, count):
    generated = []

    for i in range(count):
        playlist_id = f"{section_id}_{i}"

        generated.append({
            "id": playlist_id,
            "title": f"{section_id.replace('_', ' ').title()} {i + 1}",
            "subtitle": "Based on your activity",
            "type": "playlist",
            "image": f"https://picsum.photos/300?random={hash(playlist_id) % 1000}",
            "creator": "Spotify",
            "section": section_id,
            "order": i,
            "trackIds": generate_playlist_tracks(seed=playlist_id, size=20),  # 🟨 FIX
            "href": f"/playlists/{playlist_id}",
        })

    return generated

# 🟨 FIX: playlists are now DERIVED, not stored
def get_all_playlists():
    playlists = []

    for section in SECTIONS:
        playlists.extend(
            generate_playlists_for_section(section["id"], count=6)
        )

    return playlists

# =====================================================
# Read Helpers
# =====================================================

def get_playlist_by_id(pid):
    return next((p for p in get_all_playlists() if p["id"] == pid), None)

def get_tracks_for_playlist(pid):
    playlist = get_playlist_by_id(pid)
    if not playlist:
        return []

    return [t for t in tracks if t["id"] in playlist["trackIds"]]

def get_playlists_layout():
    response = []

    for section in sorted(SECTIONS, key=lambda s: s["order"]):
        response.append({
            **section,
            "playlists": generate_playlists_for_section(section["id"], count=6),  # 🟨 FIX
        })

    return response

def get_sections():
    return sorted(SECTIONS, key=lambda s: s["order"])

# =====================================================
# Validation Helpers
# =====================================================

def section_exists(section_id):
    return any(s["id"] == section_id for s in SECTIONS)

def validate_new_playlist(data):
    if not isinstance(data, dict):
        raise ValueError("Invalid payload format")

    if "title" not in data or not data["title"].strip():
        raise ValueError("Title is required")

def validate_playlist_update(existing, updates):
    if not isinstance(updates, dict) or not updates:
        raise ValueError("Invalid update payload")

    if "section" in updates:
        if not section_exists(updates["section"]):
            raise ValueError("Invalid section")

# =====================================================
# CRUD Mutators (User-Created Only)
# =====================================================

# 🟨 NOTE: system-generated playlists are READ-ONLY
# Only user-created playlists are mutable

_user_playlists = []

def create_playlist(data):
    validate_new_playlist(data)

    playlist_id = str(uuid.uuid4())

    new_playlist = {
        "id": playlist_id,
        "title": data["title"],
        "subtitle": data.get("subtitle"),
        "type": "playlist",
        "image": data.get("image", "https://picsum.photos/300"),
        "creator": "You",
        "trackIds": [],
        "section": "made_for_gerry",
        "order": len(_user_playlists),
        "href": f"/playlists/{playlist_id}",
    }

    _user_playlists.append(new_playlist)
    return new_playlist

def update_playlist(playlist_id, updates):
    playlist = next((p for p in _user_playlists if p["id"] == playlist_id), None)
    if not playlist:
        raise KeyError("Playlist not found")

    if "trackId" in updates and "action" in updates:
        track_id = updates["trackId"]
        action = updates["action"]

        if action == "add" and track_id not in playlist["trackIds"]:
            playlist["trackIds"].append(track_id)
        elif action == "remove" and track_id in playlist["trackIds"]:
            playlist["trackIds"].remove(track_id)
        else:
            raise ValueError("Invalid action")

        return playlist

    validate_playlist_update(playlist, updates)
    playlist.update(updates)
    return playlist

def delete_playlist(playlist_id):
    global _user_playlists
    _user_playlists = [p for p in _user_playlists if p["id"] != playlist_id]
