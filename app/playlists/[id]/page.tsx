import { fetchById, fetchTracksForPlaylist } from "@/lib/api";
import { fetchAllTracks } from "@/lib/api";
import TrackTable from "./components/TrackTable";

interface PlaylistParams {
  id: string;
}

export default async function PlaylistPage({
  params,
}: {
  params: Promise<PlaylistParams>;
}) {

  const { id } = await params;

  // Load playlist + associated tracks
  const playlist = await fetchById(id);
  const tracks = await fetchAllTracks();


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
            {tracks.length} songs
          </p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-6 mb-8">
        <button className="bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          ▶
        </button>

        <button className="text-3xl hover:text-white text-zinc-400 transition">
          ❤️
        </button>

        <button className="text-3xl hover:text-white text-zinc-400 transition">
          ⋯
        </button>
      </div>

      {/* TRACK LIST */}
      <TrackTable
        tracks={tracks}
        playlistId={id}
        includedTrackIds={playlist.trackIds} />

    </div>
  );
}
