"use client";

import { useState } from "react";
import TrackRow from "./TrackRow";

interface Track {
  id: string;
  title: string;
  artists: string[];
  album: string;
  duration: string;
}

interface TrackTableProps {
  tracks: Track[];
  included: Set<string>;
  selected: Set<string>;
  onToggleTrack?: (id: string) => void;
  onToggleSelect?: (id: string) => void;
  mode: "view" | "manage";
}

export default function TrackTable({
  tracks,
  included,
  selected,
  onToggleTrack,
  onToggleSelect,
  mode,
}: TrackTableProps) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* TABLE HEADER */}
      <div
        className="
          grid grid-cols-[32px_40px_2fr_2fr_24px_56px]
          px-4 py-2
          border-b border-zinc-800
          text-sm text-zinc-400
          items-center
        "
      >
        {/* Checkbox column */}
        {mode === "manage" ? (
          <span className="w-4 h-4 border border-zinc-700 rounded-[2px]" />
        ) : (
          <span />
        )}

        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span />
        <span className="flex justify-end">⏱</span>
      </div>

      {/* TRACK ROWS */}
      <div className="flex flex-col">
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            active={track.id === activeTrackId}
            isIncluded={included.has(track.id)}
            isSelected={selected.has(track.id)}
            onPlay={() => setActiveTrackId(track.id)}
            onToggleInclude={
              mode === "manage" && onToggleTrack
                ? () => onToggleTrack(track.id)
                : undefined
            }
            onToggleSelect={
              mode === "manage" && onToggleSelect
                ? () => onToggleSelect(track.id)
                : undefined
            }
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
}
