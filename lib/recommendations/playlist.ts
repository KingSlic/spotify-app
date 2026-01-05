import { getRecencyWeight } from "../analytics/playlist";

/* ===========================
   TYPES
   =========================== */

export interface Recommendation {
  trackId: string;
  score: number;
  reasons: string[];
  isExploration?: boolean;
}

type PlaylistTrack = {
  track: Track;
  addedAt: number;
};

/* ===========================
   LEGACY (OPTIONAL, SAFE TO KEEP)
   =========================== */

export function rankTracksByAffinity(
  scores: Map<string, number>,
  limit = 10
) {
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([trackId]) => trackId);
}

/* ===========================
   EXPLAINABLE + EXPLORATORY POLICY
   =========================== */

export function rankTracksWithReasons(
  playlistTracks: PlaylistTrack[],
  artistWeights: Map<string, number>,
  limit = 5,
  options?: {
    exploreRate?: number;      // probability exploration is enabled
    exploreFraction?: number;  // fraction of slots reserved for exploration
  }
): Recommendation[] {
  const {
    exploreRate = 0.25,
    exploreFraction = 0.3,
  } = options ?? {};

  /* ===========================
     SCORE ALL TRACKS (PURE)
     =========================== */

  const scored: Recommendation[] = playlistTracks.map(
    ({ track, addedAt }) => {
      const artistWeight =
        track.artists.reduce(
          (sum, artist) => sum + (artistWeights.get(artist) ?? 0),
          0
        ) / track.artists.length;

      const recencyWeight = getRecencyWeight(addedAt);

      const score =
        artistWeight * 0.6 +
        recencyWeight * 0.4;

      const reasons: string[] = [];

      if (artistWeight > 0.15) {
        reasons.push(
          `You frequently add tracks by ${track.artists.join(", ")}`
        );
      }

      if (recencyWeight > 0.6) {
        reasons.push(
          `This playlist has recent activity in this style`
        );
      }

      return {
        trackId: track.id,
        score,
        reasons,
      };
    }
  );

  /* ===========================
     EXPLOITATION POOL
     =========================== */

  const exploit = [...scored].sort(
    (a, b) => b.score - a.score
  );

  /* ===========================
     DECIDE WHETHER TO EXPLORE
     =========================== */

  const shouldExplore = Math.random() < exploreRate;
  if (!shouldExplore) {
    return exploit.slice(0, limit);
  }

  /* ===========================
     EXPLORATION POOL
     =========================== */

  const explorationCandidates = exploit
    .slice(Math.floor(exploit.length * 0.5)) // bottom half
    .map((rec) => ({
      ...rec,
      isExploration: true,
      reasons: [
        ...rec.reasons,
        "Exploration pick to broaden your taste",
      ],
    }));

  const exploreSlots = Math.max(
    1,
    Math.floor(limit * exploreFraction)
  );

  const pickedExplore = shuffle(explorationCandidates)
    .slice(0, exploreSlots);

  const pickedExploit = exploit
    .filter(
      (rec) =>
        !pickedExplore.some(
          (e) => e.trackId === rec.trackId
        )
    )
    .slice(0, limit - exploreSlots);

  return shuffle([...pickedExploit, ...pickedExplore])
    .slice(0, limit);
}

/* ===========================
   UTILS (PURE)
   =========================== */

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
