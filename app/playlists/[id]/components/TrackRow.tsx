"use client";

type Track = {
  id: string;
  title: string;
  artists: string[];
  album?: string;
  duration?: string;
};

interface TrackRowProps {
  track: Track;
  index: number;
  mode: "view" | "manage";
  checked: boolean;
  onToggle: () => void;
}

export default function TrackRow({
  track,
  index,
  mode,
  checked,
  onToggle,
}: TrackRowProps) {
  const inPlaylist = true; // placeholder until backend wiring

  return (
    <div
      className="
        group
        grid grid-cols-[32px_48px_3fr_2fr_48px_64px]
        gap-4
        px-4 py-2
        text-sm
        rounded
        hover:bg-white/5
      "
    >
      {/* CHECKBOX */}
      <div className="flex items-center justify-center">
        {mode === "manage" && (
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="
              w-4 h-4
              accent-green-500
              opacity-0
              group-hover:opacity-100
            "
          />
        )}
      </div>

      {/* INDEX */}
      <div className="text-zinc-400 group-hover:text-white">{index + 1}</div>

      {/* TITLE + ARTIST */}
      <div className="flex flex-col min-w-0">
        <span className="text-white truncate">{track.title}</span>
        <span className="text-zinc-400 text-xs truncate">
          {track.artists.join(", ")}
        </span>
      </div>

      {/* ALBUM */}
      <div className="text-zinc-400 truncate">{track.album ?? "—"}</div>

      {/* ADD / REMOVE TOGGLE */}
      <div className="flex items-center justify-center">
        {mode === "manage" && (
          <button
            className={`
        w-7 h-7
        flex items-center justify-center
        rounded-full
        transition
        opacity-0
        group-hover:opacity-100

        ${
          inPlaylist
            ? "bg-green-500 text-black"
            : "border border-white text-white"
        }
      `}
            title={inPlaylist ? "Remove from playlist" : "Add to playlist"}
          >
            {inPlaylist ? "✓" : "+"}
          </button>
        )}
      </div>

      {/* DURATION */}
      <div className="text-zinc-400 text-right pr-1">
        {track.duration ?? "—"}
      </div>
    </div>
  );
}
