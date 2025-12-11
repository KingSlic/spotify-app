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

export default function TrackTable({ tracks }: { tracks: Track[] }) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  return (
    <div className="w-full">

      {/* TABLE HEADER */}
      <div className="grid grid-cols-[40px_1fr_1fr_60px] px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="text-right">⏱</span>
      </div>

      {/* TRACK ROWS */}
      <div className="flex flex-col">
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            active={track.id === activeTrackId}
            onPlay={() => setActiveTrackId(track.id)}
          />
        ))}
      </div>
    </div>
  );
}
