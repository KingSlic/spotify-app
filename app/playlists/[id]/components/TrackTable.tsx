"use client";

import { useState, useEffect } from "react";
import TrackRow from "./TrackRow";
import { toggleTrackInPlaylist } from "@/lib/api";

interface Track {
  id: string;
  title: string;
  artists: string[];
  album: string;
  duration: string;
}

export default function TrackTable({
  tracks,
  playlistId,
  includedTrackIds,
}: {
  tracks: Track[];
  playlistId: string;
  includedTrackIds: string[];
}) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  // Local UI truth
  const [included, setIncluded] = useState<Set<string>>(
    () => new Set(includedTrackIds)
  );

  // Sync when playlist changes
  useEffect(() => {
    setIncluded(new Set(includedTrackIds));
  }, [includedTrackIds]);

  function toggleTrack(trackId: string) {
    const isCurrentlyIncluded = included.has(trackId);

    // Optimistic UI update
    setIncluded((prev) => {
      const next = new Set(prev);
      isCurrentlyIncluded ? next.delete(trackId) : next.add(trackId);
      return next;
    });

    // Persist to backend
    toggleTrackInPlaylist(
      playlistId,
      trackId,
      isCurrentlyIncluded ? "remove" : "add"
    ).then((updatedPlaylist) => {
      setIncluded(new Set(updatedPlaylist.trackIds));
    })

    .catch(() => {
      // Rollback on failure
      setIncluded((prev) => {
        const next = new Set(prev);
        isCurrentlyIncluded ? next.add(trackId) : next.delete(trackId);
        return next;
      });
    });
  }

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
            isIncluded={included.has(track.id)}
            onToggleInclude={() => toggleTrack(track.id)}
            onPlay={() => setActiveTrackId(track.id)}
          />
        ))}
      </div>
    </div>
  );
}
