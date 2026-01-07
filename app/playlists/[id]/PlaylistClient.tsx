"use client";

import {
  getArtistCounts,
  getArtistPreferenceWeights,
  getTopArtists,
} from "@/lib/analytics/playlist";
import { toggleTrackInPlaylist } from "@/lib/api";
import { rankTracksWithReasons } from "@/lib/recommendations/playlist";
import { useEffect, useMemo, useState } from "react";
import ReadOnlyTrackList from "./components/ReadOnlyTrackList";
import TrackTable from "./components/TrackTable";
import BulkActionBar from "./components/BulkActionBar";

/* ===========================
   TYPES
   =========================== */

type Track = {
  id: string;
  title: string;
  artists: string[];
  album: string;
  duration: string;
};

type PlaylistTrack = {
  track: Track;
  addedAt: number;
};

type Recommendation = {
  trackId: string;
  score: number;
  reasons: string[];
  isExploration?: boolean;
};

type Props = {
  playlist: any;
  playlistTracks: any[];
  tracks?: any[]; // only present in manage mode
  mode?: "view" | "manage";
};

/* ===========================
   COMPONENT
   =========================== */

export default function PlaylistClient({
  playlist,
  playlistTracks,
  tracks,
  mode = "view",
}: Props) {
  const playlistId = playlist.id;

  /* ===========================
     CORE STATE (MANAGE MODE ONLY)
     =========================== */

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectedCount = mode === "manage" ? selected.size : 0;
  const [included, setIncluded] = useState<Set<string>>(
    new Set(playlist.trackIds ?? [])
  );

  /* ===========================
   BULK ACTION DERIVED STATE
   =========================== */

const canAdd =
  mode === "manage" &&
  [...selected].some((id) => !included.has(id));

const canRemove =
  mode === "manage" &&
  [...selected].some((id) => included.has(id));

/* ===========================
   BULK ACTION HANDLERS
   =========================== */

function clearSelection() {
  setSelected(new Set());
}

async function bulkAdd() {
  if (mode !== "manage") return;

  const prev = new Set(included);

  const targets = [...selected].filter((id) => !included.has(id));
  if (targets.length === 0) return;

  setIncluded((curr) => {
    const next = new Set(curr);
    targets.forEach((id) => next.add(id));
    return next;
  });

  try {
    await Promise.all(
      targets.map((id) =>
        toggleTrackInPlaylist(playlistId, id, "add")
      )
    );
    clearSelection();
  } catch {
    setIncluded(prev);
  }
}

async function bulkRemove() {
  if (mode !== "manage") return;

  const prev = new Set(included);

  const targets = [...selected].filter((id) => included.has(id));
  if (targets.length === 0) return;

  setIncluded((curr) => {
    const next = new Set(curr);
    targets.forEach((id) => next.delete(id));
    return next;
  });

  try {
    await Promise.all(
      targets.map((id) =>
        toggleTrackInPlaylist(playlistId, id, "remove")
      )
    );
    clearSelection();
  } catch {
    setIncluded(prev);
  }
}


  /* ===========================
     ANALYTICS SOURCE (EXPLICIT)
     =========================== */

  const analyticsTracks = useMemo(() => {
    if (mode === "manage") {
      return tracks ?? [];
    }
    return playlistTracks.map((pt) => pt.track);
  }, [mode, tracks, playlistTracks]);

  const artistCounts = useMemo(
    () => getArtistCounts(analyticsTracks),
    [analyticsTracks]
  );

  const artistWeights = useMemo(
    () => getArtistPreferenceWeights(artistCounts),
    [artistCounts]
  );

  const topArtists = useMemo(
    () => getTopArtists(artistCounts, 3),
    [artistCounts]
  );

  /* ===========================
     RECOMMENDATIONS — SSR SAFE
     =========================== */

  // 🚫 NO exploration on the server
  const baseRecommendations = useMemo(
    () =>
      rankTracksWithReasons(playlistTracks, artistWeights, 5, {
        exploreRate: 0,
      }),
    [playlistTracks, artistWeights]
  );

  /* ===========================
     CLIENT-ONLY EXPLORATION
     =========================== */

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    setRecommendations(baseRecommendations);
  }, [baseRecommendations]);

  useEffect(() => {
    setRecommendations(
      rankTracksWithReasons(playlistTracks, artistWeights, 5, {
        exploreRate: 0.25,
        exploreFraction: 0.3,
      })
    );
  }, [playlistTracks, artistWeights]);

  /* ===========================
     HYDRATE TRACK OBJECTS
     =========================== */

  const recommendedTracks = useMemo(() => {
    if (mode === "manage") {
      if (!tracks) return [];
      return recommendations
        .map((rec) => ({
          ...rec,
          track: tracks.find((t) => t.id === rec.trackId),
        }))
        .filter((r) => r.track);
    }

    const trackMap = new Map(
      playlistTracks.map((pt) => [pt.track.id, pt.track])
    );

    return recommendations
      .map((rec) => ({
        ...rec,
        track: trackMap.get(rec.trackId),
      }))
      .filter((r) => r.track);
  }, [mode, recommendations, tracks, playlistTracks]);

  /* ===========================
     MUTATIONS (MANAGE MODE)
     =========================== */

  async function toggleInclude(id: string) {
    if (mode !== "manage") return;

    const action = included.has(id) ? "remove" : "add";
    const prev = new Set(included);

    setIncluded((next) => {
      const copy = new Set(next);
      action === "add" ? copy.add(id) : copy.delete(id);
      return copy;
    });

    try {
      await toggleTrackInPlaylist(playlistId, id, action);
    } catch {
      setIncluded(prev);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /* ===========================
     RENDER
     =========================== */

  return (
    <div className="text-white p-6">
      {/* 🔹 Recommendations */}
      {recommendedTracks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Suggested for this playlist
          </h2>

          <div className="space-y-3">
            {recommendedTracks.map(({ track, reasons, isExploration }) => (
              <div
                key={track.id}
                className="flex items-start justify-between text-sm"
              >
                <div>
                  <div className="flex items-center gap-2 text-white">
                    {track.title} — {track.artists.join(", ")}
                    {isExploration && (
                      <span className="text-[10px] uppercase text-amber-400">
                        Explore
                      </span>
                    )}
                  </div>

                  <ul className="text-zinc-400 list-disc ml-5">
                    {reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {mode === "manage" && (
                  <button
                    onClick={() => toggleInclude(track.id)}
                    className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
                  >
                    {included.has(track.id) ? "Remove" : "Add"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Analytics Strip */}
      {topArtists.length > 0 && (
        <div className="text-sm text-zinc-400 mb-4">
          Top artists:{" "}
          {topArtists
            .map(([artist, count]) => (
              <span key={artist} className="text-white">
                {artist} ({count})
              </span>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}
        </div>
      )}

      {/* 🔹 Read-Only Track List */}
      {mode === "view" && <ReadOnlyTrackList playlistTracks={playlistTracks} />}

      {/* 🔹 Manage-Only Table */}
      {mode === "manage" && tracks && (
        <TrackTable
          tracks={tracks}
          selected={selected}
          included={included}
          onToggleTrack={toggleInclude}
          onToggleSelect={toggleSelect}
          mode="manage"
        />
      )}

      {/* 🔹 Bulk Action Bar */}

      {mode === "manage" && (
        <BulkActionBar
          selectedCount={selectedCount}
          canAdd={canAdd}
          canRemove={canRemove}
          onAdd={bulkAdd}
          onRemove={bulkRemove}
          onClear={clearSelection}
        />
      )}
    </div>
  );
}
