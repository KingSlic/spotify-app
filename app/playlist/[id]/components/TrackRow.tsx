"use client";

import { useState } from "react";

interface Track {
  id: string;
  title: string;
  artists: string[];
  album: string;
  duration: string;
}

export default function TrackRow({
  track,
  index,
  active = false,
  onPlay,
}: {
  track: Track;
  index: number;
  active?: boolean;
  onPlay?: (track: Track) => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onPlay?.(track)}
      className={`
        grid grid-cols-[40px_1fr_1fr_60px]
        px-4 py-2
        cursor-pointer
        rounded-md
        transition-colors
        ${hover ? "bg-zinc-800/60" : ""}
      `}
    >

      {/* INDEX / PLAY ICON */}
      <span className={`flex items-center justify-center w-4
        ${active ? "text-[#1DB954]" : "text-zinc-400"}
      `}>
        {hover ? (
          <span className="text-white">▶</span>
        ) : active ? (
          "🔊"
        ) : (
          index + 1
        )}
      </span>

      {/* TITLE + ARTIST */}
      <div className="flex flex-col truncate">
        <span className={`font-medium truncate ${active ? "text-[#1DB954]" : "text-white"}`}>
          {track.title}
        </span>
        <span className="text-sm text-zinc-400 truncate">
          {track.artists.join(", ")}
        </span>
      </div>

      {/* ALBUM */}
      <span className="text-sm text-zinc-400 truncate">
        {track.album}
      </span>

      {/* DURATION */}
      <span className="text-sm text-zinc-400 text-right">
        {track.duration}
      </span>
    </div>
  );
}
