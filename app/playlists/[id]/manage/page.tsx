// app/playlists/[id]/manage/page.tsx

import {
  fetchById,
  fetchAllTracks,
  fetchPlaylistTracksWithMeta,
} from "@/lib/api";
import PlaylistClient from "../PlaylistClient";

interface PlaylistParams {
  id: string;
}

export default async function ManagePlaylistPage({
  params,
}: {
  params: Promise<PlaylistParams>;
}) {
  const { id } = await params;

  // Authoritative data
  const playlist = await fetchById(id);
  const tracks = await fetchAllTracks();
  const playlistTracks = await fetchPlaylistTracksWithMeta(id);


  if (!playlist) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold">Playlist not found</h1>
      </div>
    );
  }

  return (
    <div className="text-white p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Manage Tracks
        </h1>
        <p className="text-zinc-400 mt-1">
          Add or remove tracks from <span className="text-white">{playlist.title}</span>
        </p>
      </div>

      {/* TRACK TABLE (MoodBoard View) */}
      <PlaylistClient
        tracks={tracks}
        playlist={playlist}
        playlistTracks={playlistTracks}
        mode="manage"
      />
    </div>
  );
}
