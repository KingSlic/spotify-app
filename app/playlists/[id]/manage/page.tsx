// app/playlists/[id]/manage/page.tsx

import {
  fetchPlaylistById,
  fetchAllTracks,
} from "@/lib/api";
import PlaylistClient from "../PlaylistClient";

interface PlaylistParams {
  id: string;
}

export default async function ManagePlaylistPage({
  params,
}: {
  params: PlaylistParams;
}) {
  const { id } = params;

  // Authoritative data
  const playlist = await fetchPlaylistById(id);
  const tracks = await fetchAllTracks();

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
      mode="manage"
        tracks={tracks}
        playlist={playlist}
      />
    </div>
  );
}
