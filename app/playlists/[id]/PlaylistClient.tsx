"use client";

import { toggleTrackInPlaylist } from "@/lib/api";
import { useState } from "react";
import BulkActionBar from "./components/BulkActionBar";
import TrackTable from "./components/TrackTable";

export default function PlaylistClient({ playlist, tracks }: any) {
  const playlistId = playlist.id;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [included, setIncluded] = useState<Set<string>>(
    new Set(playlist.trackIds)
  );

  /* ===========================
     DERIVED VALUES (HERE)
     =========================== */

  const selectedCount = selected.size;

  const canAdd = Array.from(selected).some((id) => !included.has(id));

  const canRemove = Array.from(selected).some((id) => included.has(id));

  /* ===========================
     BULK ACTIONS (HERE)
     =========================== */

  async function applyBulk(action: "add" | "remove") {
    const prevIncluded = new Set(included);

    const targets = [...selected].filter((id) =>
      action === "add" ? !included.has(id) : included.has(id)
    );

    if (targets.length === 0) return;

    // 1️⃣ Optimistic update
    setIncluded((prev) => {
      const next = new Set(prev);
      targets.forEach((id) =>
        action === "add" ? next.add(id) : next.delete(id)
      );
      return next;
    });

    try {
      await Promise.all(
        targets.map((id) => toggleTrackInPlaylist(playlistId, id, action))
      );

      // 2️⃣ Clear selection AFTER success
      setSelected(new Set());
    } catch (err) {
      console.error("Bulk operation failed", err);

      // 3️⃣ Rollback
      setIncluded(prevIncluded);
    }
  }

  const bulkAdd = () => applyBulk("add");
  const bulkRemove = () => applyBulk("remove");

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function toggleInclude(id: string) {
    const action = included.has(id) ? "remove" : "add";

    const prevIncluded = new Set(included);

    setIncluded((prev) => {
      const next = new Set(prev);
      action === "add" ? next.add(id) : next.delete(id);
      return next;
    });

    try {
      await toggleTrackInPlaylist(playlistId, id, action);
    } catch {
      setIncluded(prevIncluded);
    }
  }

  function clearSelection() {
    setSelected(new Set());
  }

  return (
    <div className="text-white p-6">
      {/* playlist header stays above */}

      <BulkActionBar
        selectedCount={selectedCount}
        canAdd={canAdd}
        canRemove={canRemove}
        onAdd={bulkAdd}
        onRemove={bulkRemove}
        onClear={clearSelection}
      />

      <TrackTable
        tracks={tracks}
        selected={selected}
        included={included}
        onToggleTrack={toggleInclude}
        onToggleSelect={toggleSelect}
      />
    </div>
  );
}
