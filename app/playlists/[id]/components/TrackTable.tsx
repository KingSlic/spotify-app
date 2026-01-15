"use client";

import { useEffect, useRef, useState } from "react";
import TrackRow from "./TrackRow";
import BulkActionBar from "./BulkActionBar";

type Track = {
  id: string;
  title: string;
  artists: string[];
  album?: string;
  duration?: string;
};

interface TrackTableProps {
  tracks: Track[];
  mode: "view" | "manage";
}

export default function TrackTable({ tracks, mode }: TrackTableProps) {
  // ─────────────────────────────────────────────
  // Selection state (authoritative)
  // ─────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedCount = selectedIds.size;
  const allSelected = tracks.length > 0 && selectedCount === tracks.length;
  const noneSelected = selectedCount === 0;
  const partiallySelected = !allSelected && !noneSelected;

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  function toggleAll() {
    setSelectedIds(
      allSelected ? new Set() : new Set(tracks.map((t) => t.id))
    );
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // BulkActionBar permissions (same semantics you had before)
  const canRemove = selectedCount > 0;
  const canAdd = false;

  return (
    <div className="mt-6">
      {/* BULK ACTION BAR */}
      <BulkActionBar
        selectedCount={selectedCount}
        canAdd={canAdd}
        canRemove={canRemove}
        onAdd={() => {
          console.log("ADD:", Array.from(selectedIds));
        }}
        onRemove={() => {
          console.log("REMOVE:", Array.from(selectedIds));
        }}
        onClear={() => setSelectedIds(new Set())}
      />

      {/* TABLE HEADER */}
      <div
        className="
          grid grid-cols-[32px_48px_3fr_2fr_48px_64px]
          gap-4
          px-4 py-2
          text-xs
          uppercase
          tracking-wider
          text-zinc-400
          border-b border-white/10
        "
      >
        {/* SELECT ALL */}
        <div className="flex items-center justify-center">
          {mode === "manage" && (
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="
                w-4 h-4
                accent-green-500
                opacity-80
                hover:opacity-100
              "
            />
          )}
        </div>

        <div>#</div>
        <div>Title</div>
        <div>Album</div>
        <div />
        <div className="flex justify-end pr-1">⏱</div>
      </div>

      {/* ROWS */}
      <div className="flex flex-col">
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            mode={mode}
            checked={selectedIds.has(track.id)}
            onToggle={() => toggleOne(track.id)}
          />
        ))}
      </div>
    </div>
  );
}
