
const API_BASE = "http://127.0.0.1:5001/api";

export async function fetchPlaylists() {
  const res = await fetch(`${API_BASE}/playlists`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch playlists");
  return res.json();
}

export async function fetchPlaylistById(id: string) {
  const res = await fetch(`${API_BASE}/playlists/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchTracksForPlaylist(id: string) {
  const res = await fetch(`${API_BASE}/playlists/${id}/tracks`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}
