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
    },
    {
        "id": "2",
        "title": "Daily Mix 2",
        "subtitle": "Your weekly vibe",
        "type": "playlist",
        "image": "https://picsum.photos/300?random=2",
        "creator": "Spotify",
        "trackIds": ["t3", "t4"],
    },
    {
        "id": "3",
        "title": "Daily Mix 3",
        "subtitle": "Chill mode engaged",
        "type": "playlist",
        "image": "https://picsum.photos/300?random=3",
        "creator": "Spotify",
        "trackIds": ["t1", "t4"],
    },
]

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
