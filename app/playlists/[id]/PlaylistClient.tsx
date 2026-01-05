"use client";

import {
  getArtistCounts,
  getArtistPreferenceWeights,
  getTopArtists,
} from "@/lib/analytics/playlist";
import { toggleTrackInPlaylist } from "@/lib/api";
import { rankTracksWithReasons } from "@/lib/recommendations/playlist";
import { useEffect, useMemo, useState } from "react";

import TrackTable from "./components/TrackTable";

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
  playlistTracks: PlaylistTrack[];
  tracks?: Track[]; // only present in manage mode
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
  const [included, setIncluded] = useState<Set<string>>(
    new Set(playlist.trackIds ?? [])
  );

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

  const [recommendations, setRecommendations] =
    useState<Recommendation[]>(baseRecommendations);

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

      {/* 🔹 Manage-Only Table */}
      {mode === "manage" && tracks && (
        <TrackTable
          tracks={tracks}
          selected={selected}
          included={included}
          onToggleTrack={toggleInclude}
          onToggleSelect={(id) =>
            setSelected((prev) => {
              const next = new Set(prev);
              next.has(id) ? next.delete(id) : next.add(id);
              return next;
            })
          }
        />
      )}
    </div>
  );
}
