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
# Track Pool (Expanded)
# -----------------------------

tracks = [
    {
        "id": f"t{i}",
        "title": f"Track {i}",
        "artists": [f"Artist {i % 5}"],
        "album": f"Album {i % 3}",
        "duration": "3:30",
    }
    for i in range(1, 101)
]
# 🟨 FIX: expanded track pool so 20-track playlists are possible

# -----------------------------
# Playlist Generation Helpers
# -----------------------------


def generate_playlist_tracks(seed, size=20):
    rng = random.Random(seed)
    chosen = rng.sample(tracks, size)
    now = int(time.time())

    return [
        {
          "trackId": t["id"],
          "addedAt": now - rng.randint(0, 60 * 60 * 24 * 30)  # added within last 30 days
        } for t in chosen
    ]


def get_playlist_image(section_id, index):
    return (
        f"https://picsum.photos/300?random={abs(hash(section_id + str(index))) % 1000}"
    )


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
          "trackIds": [t["id"] for t in generate_playlist_tracks(seed=playlist_id, size=20)],
          "href": f"/playlists/{playlist_id}",
          "section": section_id,
          "order": i,
      })

  return generated


playlists = []

# Initial static playlists (optional — you can remove later)
playlists.extend([
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
        "order": 0,
    }
])

# Auto-generate playlists per section
for section in SECTIONS:
    section_id = section["id"]

    generated = generate_playlists_for_section(
        section_id=section_id,
        count=6  # 🔑 change to 8 if you want
    )

    playlists.extend(generated)


# 🟨 FIX: valid function, deterministic IDs, 20 tracks each

# -----------------------------
# Layout (Authoritative)
# -----------------------------


def get_playlists_layout():
    response = []

    for section in sorted(SECTIONS, key=lambda s: s["order"]):
        generated_playlists = generate_playlists_for_section(
            section_id=section["id"], count=random.randint(6, 8)
        )
        # 🟨 FIX: section now owns playlist generation

        response.append(
            {
                **section,
                "playlists": generated_playlists,
            }
        )

    return response


# -----------------------------
# Read Helpers
# -----------------------------


def get_playlist_by_id(pid):
    for section in SECTIONS:
        generated = generate_playlists_for_section(section["id"], 8)
        for p in generated:
            if p["id"] == pid:
                return p
    return None


def get_tracks_for_playlist(pid):
    playlist = get_playlist_by_id(pid)
    if not playlist:
        return []

    result = []
    for entry in playlist["tracks"]:
        track = next(t for t in tracks if t["id"] == entry["trackId"])
        result.append({
          "track": track,
          "addedAt": entry["addedAt"]
        })

    return result


def get_sections():
    return sorted(SECTIONS, key=lambda s: s["order"])


# 🟨 FIX: added function to get sections
