"use client";

interface PlaylistTrack {
  addedAt: number;
  track: {
    id: string;
    title: string;
    artists: string[];
    album: string;
    duration: string;
  };
}

export default function ReadOnlyTrackList({
  playlistTracks,
}: {
  playlistTracks: PlaylistTrack[];
}) {
  if (playlistTracks.length === 0) {
    return (
      <div className="text-sm text-zinc-500 mt-8">
        This playlist has no tracks yet.
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* HEADER */}
      <div
        className="
          grid grid-cols-[40px_2fr_2fr_60px]
          px-4 py-2
          border-b border-zinc-800
          text-sm text-zinc-400
        "
      >
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="text-right">⏱</span>
      </div>

      {/* ROWS */}
      <div className="flex flex-col">
        {playlistTracks.map(({ track }, index) => (
          <div
            key={track.id}
            className="
              grid grid-cols-[40px_2fr_2fr_60px]
              px-4 py-2
              items-center
              hover:bg-zinc-800/60
              rounded-md
              transition-colors
            "
          >
            <span className="text-zinc-400 text-sm">{index + 1}</span>

            <div className="flex flex-col truncate min-w-0">
              <span className="text-white truncate">{track.title}</span>
              <span className="text-sm text-zinc-400 truncate">
                {track.artists.join(", ")}
              </span>
            </div>

            <span className="text-sm text-zinc-400 truncate">
              {track.album}
            </span>

            <span className="text-sm text-zinc-400 text-right">
              {track.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
