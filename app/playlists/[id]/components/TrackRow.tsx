"use client";

import { useState } from "react";

interface Track {
  id: string;
  title: string;
  artists: string[];
  album: string;
  duration: string;
}

interface TrackRowProps {
  track: Track;
  index: number;
  active?: boolean;
  isIncluded: boolean;
  onToggleInclude: () => void;
  onPlay?: (track: Track) => void;
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 8v8M8 12h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" fill="#1DB954" />
      <path
        d="M8.5 12.5l2.5 2.5 4.5-5"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TrackRow({
  track,
  index,
  active = false,
  isIncluded,
  onToggleInclude,
  onPlay,
}: TrackRowProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onPlay?.(track)}
      className={`
        grid grid-cols-[40px_2fr_2fr_40px_60px]
        items-center
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
      <div className="flex flex-col truncate min-w-0">
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


      {/* ADD / REMOVE TOGGLE */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // critical
          onToggleInclude();
        }}
        className="flex items-center justify-center text-zinc-400 hover:text-white"
      >
        {isIncluded ? <CheckIcon /> : <PlusIcon />}
      </button>

      {/* DURATION */}
      <span className="text-sm text-zinc-400 text-right whitespace-nowrap">
        {track.duration}
      </span>
    </div>
  );
}
