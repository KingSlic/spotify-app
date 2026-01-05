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
  isSelected: boolean;
  mode: "view" | "manage";
  onToggleInclude?: () => void;
  onToggleSelect?: () => void;
  onPlay?: () => void;
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
  isSelected,
  mode,
  onToggleInclude,
  onToggleSelect,
  onPlay,
}: TrackRowProps) {
  const [hover, setHover] = useState(false);

  const isManage = mode === "manage";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onPlay}
      className="
        grid grid-cols-[32px_40px_2fr_2fr_24px_56px]
        px-4 py-2
        cursor-pointer
        rounded-md
        transition-colors
        hover:bg-zinc-800/60
        items-center
      "
    >
      {/* SELECT BOX (manage-only) */}
      {isManage ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.();
          }}
          className={`
            w-4 h-4
            border
            rounded-[2px]
            flex items-center justify-center
            transition-colors
            ${
              isSelected
                ? "bg-[#1DB954] border-[#1DB954]"
                : "border-zinc-500 hover:border-white"
            }
          `}
        >
          {isSelected && (
            <svg viewBox="0 0 16 16" className="w-3 h-3">
              <path
                d="M3.5 8.5l3 3 6-6"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      ) : (
        <span />
      )}

      {/* INDEX / PLAY ICON */}
      <span
        className={`flex items-center justify-start w-4 ${
          active ? "text-[#1DB954]" : "text-zinc-400"
        }`}
      >
        {hover ? <span className="text-white">▶</span> : active ? "🔊" : index + 1}
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
      <span className="text-sm text-zinc-400 truncate">{track.album}</span>

      {/* ADD / REMOVE TOGGLE (manage-only) */}
      {isManage ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleInclude?.();
          }}
          className="flex items-center justify-start text-zinc-400 hover:text-white"
          aria-label={isIncluded ? "Remove from playlist" : "Add to playlist"}
        >
          {isIncluded ? <CheckIcon /> : <PlusIcon />}
        </button>
      ) : (
        <span />
      )}

      {/* DURATION */}
      <span className="text-sm text-zinc-400 text-right whitespace-nowrap">
        {track.duration}
      </span>
    </div>
  );
}
