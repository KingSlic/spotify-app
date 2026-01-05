import { fetchById, fetchPlaylistTracksWithMeta, fetchTracksForPlaylist } from "@/lib/api";
import PlaylistClient from "./PlaylistClient";



interface PlaylistParams {
  id: string;
}

export default async function PlaylistPage({
  params
}: {
  params: Promise<PlaylistParams>;
}) {

  const { id } = await params;

  // Load playlist + associated tracks
  const playlist = await fetchById(id);
  const playlistTracks = await fetchPlaylistTracksWithMeta(id);


  // Handle not found
  if (!playlist) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold">Playlist not found.</h1>
      </div>
    );
  }

  return (
    <div className="text-white p-6">

      {/* PLAYLIST HEADER */}
      <div className="flex items-end gap-6 mb-10">

        {/* COVER ART */}
        <div className="w-48 h-48 shadow-lg">
          <img
            src={playlist.image}       // <-- updated from playlist.cover
            alt={playlist.title}       // <-- updated from playlist.name
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* TEXT INFO */}
        <div className="flex flex-col">

          <p className="uppercase text-sm font-medium text-zinc-300">
            {playlist.type}
          </p>

          <h1 className="text-6xl font-extrabold mt-2 mb-4">
            {playlist.title}
          </h1>

          {playlist.subtitle && (
            <p className="text-zinc-300 mb-2">{playlist.subtitle}</p>
          )}

          <p className="text-sm text-zinc-400">
            {playlist.creator}
            {" • "}
            {playlistTracks.length} songs
          </p>
        </div>
      </div>



      <PlaylistClient
        mode="view"
        playlist={playlist}
        playlistTracks={playlistTracks}
      />

    </div>
  );
}
