const API_BASE = "http://127.0.0.1:5000/api";

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

export type Section = {
  id: string;
  title: string;
  order: number;
  showAllHref: string | null;
};

export type Playlist = {
  id: string
  title: string;
  subtitle: string;
  image: string;
  href?: string | null;
  order: number
  section: string
}

export type SectionWithPlaylists = {
  id: string
  playlists: Playlist[]
}

export async function getPlaylistsBySection(): Promise<SectionWithPlaylists[]> {
  const res = await fetch(`${API_BASE}/playlists`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch playlists");

  return res.json();
}

// Mirrors the backend contract

export async function getPlaylistsLayout() {
  const res = await fetch("http://127.0.0.1:5000/api/playlists", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch playlists layout")
  }

  return res.json()
}


export async function getSections(): Promise<Section[]> {
  const res = await fetch(`${API_BASE}/sections`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch sections");

  return res.json();
}

export async function updatePlaylist(
  id: string,
  updates: Partial<{
    title: string;
    subtitle: string;
    image: string;
    href?: string;
  }>
) {

  const res = await fetch(`${API_BASE}/playlists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Failed to update playlist");
  return res.json();
}

export async function deletePlaylist(id: string) {
  const res = await fetch(`${API_BASE}/playlists/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete playlist");
  return res.json();
}
