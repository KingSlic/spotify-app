"use client";

import { useMemo } from "react";
import TrackTable from "./components/TrackTable";
import { getArtistCounts } from "@/lib/analytics/playlist";
import { rankTracksWithReasons } from "@/lib/recommendations/playlist";
import { Playlist } from "@/lib/api";

type Track = {
  id: string;
  title: string;
  artists: string[];
  album?: string;
  duration?: string;
  addedAt?: number;
};

interface PlaylistClientProps {
  mode: "view" | "manage";
  playlist: Playlist;
  playlistTracks: Track[];
  allTracks?: Track[];
}

export default function PlaylistClient({
  mode,
  playlist,
  playlistTracks,
}: PlaylistClientProps) {
  /**
   * -----------------------------
   * ANALYTICS (read-only)
   * -----------------------------
   * Full tracks only. Never joins.
   */
  const artistCounts = useMemo(() => {
    return getArtistCounts(playlistTracks);
  }, [playlistTracks]);

  /**
   * -----------------------------
   * RECOMMENDATIONS (policy layer)
   * -----------------------------
   * Operates on full tracks only.
   */
  const recommendations = useMemo(() => {
    return rankTracksWithReasons(playlistTracks);
  }, [playlistTracks]);

  /**
   * -----------------------------
   * EMPTY STATE
   * -----------------------------
   */
  if (playlistTracks.length === 0) {
    return (
      <div className="text-zinc-500 italic px-4 py-8">
        This playlist doesn’t have any tracks yet.
      </div>
    );
  }

  /**
   * -----------------------------
   * MAIN RENDER
   * -----------------------------
   */
  return (
    <div className="flex flex-col gap-8">
      {/* TRACK TABLE */}
      <TrackTable
        tracks={playlistTracks}
        mode="manage"
      />

      {/* ANALYTICS SUMMARY (optional, non-blocking) */}
      <div className="text-xs text-zinc-500 px-4">
        Top artist:{" "}
        {Array.from(artistCounts.entries())[0]?.[0] ?? "—"}
      </div>

      {/* RECOMMENDATIONS (optional, non-blocking) */}
      {recommendations.length > 0 && (
        <div className="px-4">
          <h3 className="text-sm font-semibold text-white mb-2">
            Recommended next
          </h3>

          <ul className="text-xs text-zinc-400 list-disc ml-4 space-y-1">
            {recommendations.slice(0, 5).map((rec) => (
              <li key={rec.track.id}>
                {rec.track.title} — {rec.track.artists.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
