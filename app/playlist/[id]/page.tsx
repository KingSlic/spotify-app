

interface PlaylistParams {
  id: string;
}

export default async function PlaylistPage({ params }: { params: Promise<PlaylistParams> }) {

  const { id } = await params;

  // TEMP FAKE DATA — we will replace with real DB/API later
  const playlist = {
    id,
    name: "Daily Mix 1",
    description: "A mix of your favorites. Updated daily.",
    cover: "/placeholder-cover.jpg",
    creator: "Made for Gerry",
    songCount: 50,
  };

  return (
    <div className="text-white p-6">

      {/* HEADER SECTION */}
      <div className="flex items-end gap-6 mb-10">

        {/* COVER ART */}
        <div className="w-48 h-48 shadow-lg">
          <img
            src={playlist.cover}
            alt={playlist.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* TEXT INFO */}
        <div className="flex flex-col">
          <p className="uppercase text-sm font-medium text-zinc-300">Playlist</p>

          <h1 className="text-6xl font-extrabold mt-2 mb-4">
            {playlist.name}
          </h1>

          <p className="text-zinc-300 mb-2">{playlist.description}</p>

          <p className="text-sm text-zinc-400">
            {playlist.creator} • {playlist.songCount} songs
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

      const fakeTracks = [
        {
          id: "1",
          title: "Save Your Tears",
          artists: ["The Weeknd"],
          album: "After Hours",
          duration: "3:36",
        },
        {
          id: "2",
          title: "Blinding Lights",
          artists: ["The Weeknd"],
          album: "After Hours",
          duration: "3:20",
        },
        {
          id: "3",
          title: "Passionfruit",
          artists: ["Drake"],
          album: "More Life",
          duration: "4:18",
        },
      ];


      {/* TRACK LIST - Placeholder for now */}
      <TrackTable tracks={fakeTracks} />

    </div>
  );
}
