import random
import time

# ----------------------------------------
# GLOBAL TRACK POOL (normalized)
# ----------------------------------------

# You can expand this list later or generate it procedurally.
# Track IDs are canonical and referenced everywhere else.
tracks = [
    {
        "id": f"t-{i}",
        "title": f"Track {i}",
        "artists": [f"Artist {i % 5}"],
        "album": f"Album {i % 3}",
        "duration": f"{random.randint(2,4)}:{random.randint(0,59):02d}",  # "mm:ss"
        "image": f"https://picsum.photos/seed/track-{i}/300",
    }
    for i in range(60)  # global pool size
]


# ----------------------------------------
# JOIN TABLE: playlist_tracks
# ----------------------------------------



def generate_playlist_tracks(seed, size=20):
    rng = random.Random(seed)
    now = int(time.time())

    # ensure sample size viability
    size = min(size, len(tracks))
    chosen = rng.sample(tracks, size)

    return [
        {
            "id": t["id"],  # normalized reference to global tracks
            "addedAt": now - rng.randint(0, 60 * 60 * 24 * 30),  # within last 30 days
        }
        for t in chosen
    ]


playlist_tracks = {}  # map: playlist_id → [join]


# ----------------------------------------
# PLAYLISTS (normalized)
# Do NOT embed tracks; just store trackIds
# ----------------------------------------


def playlist_image(playlist_id):
    return f"playlist:{playlist_id}"


def generate_playlists_for_section(section_id, count=6):

    rng = random.Random(str(section_id))
    playlists = []

    for i in range(count):
        playlist_id = f"pl-{section_id}-{i}"
        joins = generate_playlist_tracks(seed=playlist_id, size=20)

        # store join objects in map
        playlist_tracks[playlist_id] = joins

        playlists.append(
            {
                "id": playlist_id,
                # "title": f"{section['title']} Playlist {i + 1}",
                "sectionId": playlist_id,
                "trackIds": [j["id"] for j in joins],
                "createdAt": int(time.time()) - rng.randint(0, 60 * 60 * 24 * 7),
                "image": {
                  "kind": "generated",
                  "seed": playlist_image(playlist_id),
                },
                "type": "playlist",
                "creator": "Spotify",
                "subtitle": "Based on your activity",
                "href": f"/playlists/{playlist_id}",
            }
        )

    return playlists


# ----------------------------------------
# SECTIONS (UI only)
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

playlists_by_section = {
    section["id"]: generate_playlists_for_section(section["id"], count=6)
    for section in SECTIONS
}


# ----------------------------------------
# EXPORT-LIKE HELPERS (optional)
# ----------------------------------------


def get_all_tracks():
    return tracks


def get_playlists_for_section(section_id):
    return playlists_by_section.get(section_id, [])


def get_playlist_by_id(playlist_id):
    for section_id in SECTIONS:
        for pl in playlists_by_section[section_id]:
            if pl["id"] == playlist_id:
                return pl
    return None


def get_playlist_tracks(playlist_id):
    return playlist_tracks.get(playlist_id, [])


def get_sections():
    return sorted(SECTIONS, key=lambda s: s["order"])
