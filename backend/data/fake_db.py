import random
import time

# ----------------------------------------
# GLOBAL TRACK POOL
# ----------------------------------------

tracks = [
    {
        "id": f"t-{i}",
        "title": f"Track {i}",
        "artists": [f"Artist {i % 5}"],
        "album": f"Album {i % 3}",
        "duration": f"{random.randint(2,4)}:{random.randint(0,59):02d}",
        "image": f"https://picsum.photos/seed/track-{i}/300",
    }
    for i in range(60)
]


# ----------------------------------------
# PLAYLIST ↔ TRACK JOIN TABLE
# ----------------------------------------

playlist_tracks = {}


def generate_playlist_tracks(seed, size=20):
    rng = random.Random(seed)
    now = int(time.time())

    chosen = rng.sample(tracks, min(size, len(tracks)))

    return [
        {
            "id": t["id"],
            "addedAt": now - rng.randint(0, 60 * 60 * 24 * 30),
        }
        for t in chosen
    ]


# ----------------------------------------
# SECTIONS (BACKEND-OWNED DATA)
# ----------------------------------------

SECTIONS = [
    {
        "id": "recently_played",
        "title": "Recently Played",
        "order": 0,
        "showAllHref": None,
    },
    {
        "id": "made_for_you",
        "title": "Made for You",
        "order": 1,
        "showAllHref": "/sections/made_for_you",
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

SECTION_PLAYLIST_TITLES = {
    "recently_played": lambda i: f"Daily Mix {i + 1}",
    "made_for_you": lambda i: f"Daily Mix {i + 1}",
    "your_weekly_vibe": lambda i: f"Your Vibe {i + 1}",
    "chill_mode_engaged": lambda i: f"Chill Mix {i + 1}",
}


# ----------------------------------------
# PLAYLIST GENERATION (SIMPLE + SAFE)
# ----------------------------------------


def playlist_image(playlist_id):
    return f"https://picsum.photos/seed/{playlist_id}/300"


def generate_playlists_for_section(section, count=6):
    rng = random.Random(section["id"])
    playlists = []

    title_fn = SECTION_PLAYLIST_TITLES.get(section["id"], lambda i: f"Playlist {i + 1}")

    for i in range(count):
        playlist_id = f"pl-{section['id']}-{i}"
        joins = generate_playlist_tracks(seed=playlist_id)

        playlist_tracks[playlist_id] = joins

        playlists.append(
            {
                "id": playlist_id,
                "title": f"{section['title']} Playlist {i + 1}",
                "sectionId": section["id"],
                "trackIds": [j["id"] for j in joins],
                "createdAt": int(time.time()) - rng.randint(0, 60 * 60 * 24 * 7),
                "image": playlist_image(playlist_id),  # ✅ STRING
                "type": "playlist",
                "creator": "Spotify",
                "subtitle": "Based on your activity",
                "href": f"/playlists/{playlist_id}",
            }
        )

    return playlists


playlists_by_section = {
    section["id"]: generate_playlists_for_section(section) for section in SECTIONS
}


# ----------------------------------------
# HELPERS
# ----------------------------------------


def get_sections():
    return sorted(SECTIONS, key=lambda s: s["order"])


def get_playlists_for_section(section_id):
    return playlists_by_section.get(section_id, [])


def get_playlist_by_id(playlist_id):
    for section_id in playlists_by_section:
        for pl in playlists_by_section[section_id]:
            if pl["id"] == playlist_id:
                return pl
    return None


def get_playlist_tracks(playlist_id):
    return playlist_tracks.get(playlist_id, [])


def get_all_tracks():
    return tracks
