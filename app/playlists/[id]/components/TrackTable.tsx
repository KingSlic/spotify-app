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

export default function TrackTable({
  tracks,
  included,
  selected,
  onToggleTrack,
  onToggleSelect,
}: {
  tracks: Track[];
  included: Set<string>;
  selected: Set<string>;
  onToggleTrack: (id: string) => void;
  onToggleSelect: (id: string) => void;
}) {
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
            items-center"
      >
        <span className="w-4 h-4 border border-zinc-700 rounded-[2px]" />
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
            onToggleInclude={() => onToggleTrack(track.id)}
            onPlay={() => setActiveTrackId(track.id)}
            isSelected={selected.has(track.id)}
            onToggleSelect={() => onToggleSelect(track.id)}
          />
        ))}
      </div>
    </div>
  );
}
