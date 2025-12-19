# backend/data/fake_db.py

playlists = [
    {
        "id": "1",
        "title": "Daily Mix 1",
        "subtitle": "Made for Gerry",
        "type": "playlist",
        "image": "https://picsum.photos/300?random=1",
        "creator": "Spotify",
        "trackIds": ["t1", "t2", "t3"],
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
        "section": "your_weekly_vibe",
        "order": 2,
    },
    {
        "id": "3",
        "title": "Daily Mix 3",
        "subtitle": "Chill mode engaged",
        "type": "playlist",
        "image": "https://picsum.photos/300?random=3",
        "creator": "Spotify",
        "trackIds": ["t1", "t4"],
        "section": "chill_mode_engaged",
        "order": 3,
    },
]


SECTIONS = {
    "good_evening": {
        "id": "good_evening",
        "title": "Good evening",
        "order": 1,
        "showAllHref": None,
    },
    "made_for_you": {
        "id": "made_for_you",
        "title": "Made for you",
        "order": 2,
        "showAllHref": "/section/made-for-you",
    },
    "recently_played": {
        "id": "recently_played",
        "title": "Recently played",
        "order": 3,
        "showAllHref": None,
    },
}


SECTION_ORDER = {
    "made_for_gerry": 1,
    "your_weekly_vibe": 2,
    "chill_mode_engaged": 3,
}

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


def get_playlist_by_id(pid):
    return next((p for p in playlists if p["id"] == pid), None)


def get_tracks_for_playlist(pid):
    playlist = get_playlist_by_id(pid)
    if not playlist:
        return []

    return [t for t in tracks if t["id"] in playlist["trackIds"]]


def get_playlists_grouped_by_section():
    grouped = {}

    for playlist in playlists:
        section_key = playlist["section"]
        grouped.setdefault(section_key, []).append(playlist)

    for section_playlists in grouped.values():
        section_playlists.sort(key=lambda p: p["order"])

    ordered_sections = sorted(
        SECTIONS.values(),
        key=lambda s: s["order"],
    )

    response = []

    for section in ordered_sections:
        section_playlists = grouped.get(section["id"], [])
        if not section_playlists:
            continue

        response.append({**section, "playlists": section_playlists})

    return response


def get_sections():
    return sorted(
        SECTIONS.values(),
        key=lambda section: section["order"],
    )


def is_valid_section(section_id):
    return section_id in SECTIONS


def validate_new_playlist(data):
    required_fields = {"title", "subtitle", "image", "section", "order"}

    if not isinstance(data, dict):
        return "Invalid payload format"

    missing = required_fields - data.keys()
    if missing:
        return f"Missing required fields: {', '.join(missing)}"

    if not isinstance(data["order"], int) or data["order"] < 1:
        return "Order must be a positive integer"

    if not is_valid_section(data["section"]):
        return f"Invalid section: {data['section']}"

    return None


def update_playlist(playlist_id, updates):
    playlist = next((p for p in playlists if p["id"] == playlist_id), None)
    if not playlist:
        return None

    allowed_fields = {"title", "subtitle", "image", "href"}
    for key, value in updates.items():
        if key in allowed_fields:
            playlist[key] = value
    return playlist


def validate_playlist_updates(data):
    if not isinstance(data, dict):
        return "Invalid payload format"
    allowed_fields = {
        "title": str,
        "subtitle": str,
        "image": str,
        "href": (str, type(None)),
    }
    if not data:
        return "At least one field must be provided for update"

    for key, value in data.items():
        if key not in allowed_fields:
            return f"Invalid field: {key} is not allowed"

        expected_type = allowed_fields[key]

        if not isinstance(value, expected_type):
            return f"Field '{key}' must be of type {expected_type}"

        if isinstance(value, str) and not value.strip():
            return f"Field '{key}' cannot be empty"

    return None


def reorder_playlist(playlist_id, new_order):
    playlist = next((p for p in playlists if p["id"] == playlist_id), None)
    if not playlist:
        return None, "Playlist not found"

    if not isinstance(new_order, int) or new_order < 1:
        return None, "Order must be a positive integer"

    section = playlist["section"]

    # get all playlists in the same section, excluding this one
    section_playlists = [
        p for p in playlists if p["section"] == section and p["id"] != playlist_id
    ]

    # shift other playlists to make room for the new order
    for p in section_playlists:
        if p["order"] >= new_order:
            p["order"] += 1

    playlist["order"] = new_order
    return playlist, None


def delete_playlist(playlist_id):
    global playlists
    initial_len = len(playlists)
    playlists = [p for p in playlists if p["id"] != playlist_id]
    return len(playlists) < initial_len
