# backend/data/fake_db.py

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
# Playlist Data
# -----------------------------

playlists = [
    {
        "id": "0",
        "title": "Recently Played Mix",
        "subtitle": "Based on your activity",
        "type": "playlist",
        "image": "https://picsum.photos/300?random=10",
        "creator": "Spotify",
        "trackIds": ["t1", "t2"],
        "href": "/playlists/0",
        "section": "recently_played",
        "order": 1,
    },
    {
        "id": "1",
        "title": "Daily Mix 1",
        "subtitle": "Made for Gerry",
        "type": "playlist",
        "image": "https://picsum.photos/300?random=1",
        "creator": "Spotify",
        "trackIds": ["t1", "t2", "t3"],
        "href": "/playlists/1",
        "section": "made_for_gerry",
        "order": 1,
    },
    {
        "id": "2",
        "title": "Daily Mix 2",
        "subtitle": "Your weekly vibe",
        "type": "playlist",
        "image": "https://picsum.photos/300?random=2",
        "creator": "Spotify",
        "trackIds": ["t3", "t4"],
        "href": "/playlists/2",
        "section": "your_weekly_vibe",
        "order": 1,
    },
    {
        "id": "3",
        "title": "Daily Mix 3",
        "subtitle": "Chill mode engaged",
        "type": "playlist",
        "image": "https://picsum.photos/300?random=3",
        "creator": "Spotify",
        "trackIds": ["t1", "t4"],
        "href": "/playlists/3",
        "section": "chill_mode_engaged",
        "order": 1,
    },
]


# -----------------------------
# Track Data
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


# =====================================================
# Read Helpers
# =====================================================


def get_playlist_by_id(pid):
    return next((p for p in playlists if p["id"] == pid), None)


def get_tracks_for_playlist(pid):
    playlist = get_playlist_by_id(pid)
    if not playlist:
        return []

    return [t for t in tracks if t["id"] in playlist["trackIds"]]


def get_playlists_layout():
    response = []

    sorted_sections = sorted(SECTIONS, key=lambda s: s["order"])

    for section in sorted_sections:
        section_playlists = [p for p in playlists if p["section"] == section["id"]]
        section_playlists.sort(key=lambda p: p["order"])

        response.append(
            {
                **section,
                "playlists": section_playlists,
            }
        )

    return response


def get_sections():
    return sorted(SECTIONS, key=lambda s: s["order"])


# =====================================================
# Validation Helpers
# =====================================================


def section_exists(section_id):
    return any(s["id"] == section_id for s in SECTIONS)


def get_playlists_in_section(section_id):
    return [p for p in playlists if p["section"] == section_id]


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

    new_section = updates.get("section", existing["section"])
    new_order = updates.get("order", existing["order"])

    if "order" in updates:
        if not isinstance(new_order, int) or new_order < 1:
            raise ValueError("Order must be a positive integer")

    section_playlists = get_playlists_in_section(new_section)
    for p in section_playlists:
        if p["id"] != existing["id"] and p["order"] == new_order:
            raise ValueError("Duplicate order in section")


# =====================================================
# CRUD Mutators
# =====================================================


def create_playlist(data):
    validate_new_playlist(data)

    playlist_id = generate_id()

    """
    Creates a new empty playlist.

    Server-owned:
    - id
    - section
    - order
    - trackIds

    Client supplies:
    - title
    - optional subtitle/image
    """

    new_playlist = {
        "id": playlist_id(),  # simple increment or uuid
        "title": data["title"],
        "subtitle": data.get("subtitle", None),
        "type": "playlist",
        "image": data.get("image", default_image()),
        "creator": "You",
        "trackIds": [],
        "section": "made_for_gerry",  # default section
        "order": next_order("made_for_gerry"),
        "href": f"/playlists/{playlist_id}",
    }

    playlists.append(new_playlist)
    return new_playlist


def update_playlist(playlist_id, updates):
    playlist = get_playlist_by_id(playlist_id)

    if "id" in updates:
        raise ValueError("Cannot update playlist id")

    if "trackIds" in updates:
        raise ValueError("Track mutation not supported yet")

    if not playlist:
        raise KeyError("Playlist not found")

    validate_playlist_update(playlist, updates)
    playlist.update(updates)
    return playlist


def delete_playlist(playlist_id):
    global playlists
    playlist = get_playlist_by_id(playlist_id)
    if not playlist:
        raise KeyError("Playlist not found")

    playlists = [p for p in playlists if p["id"] != playlist_id]
