import { getRecencyWeight } from "../analytics/playlist";

export interface Recommendation {
  trackId: string;
  score: number;
  reasons: string[];
  isExploration?: boolean;
}

interface ExplorationOptions {
  exploreRate?: number;
  exploreFraction?: number;
  artistCap?: number;
}

export function rankTracksWithReasons(
  playlistTracks: {
    track: Track;
    addedAt: number;
  }[],
  artistWeights: Map<string, number>,
  limit = 5,
  options?: {
    excludeTrackIds?: Set<string>;
    exploreRate?: number;
    exploreFraction?: number;
  }
): Recommendation[] {
  // 🔒 Policy invariant: never recommend already-included tracks

  const recommendations: Recommendation[] = [];

  const {
    artistCap = Infinity,
    exploreRate = 0,
    exploreFraction = 0,
  } = options || {}

  // console.log({ artistCap, exploreRate, exploreFraction });


  for (const { track, addedAt } of playlistTracks) {
    const exclude = options?.excludeTrackIds;
    if (exclude?.has(track.id)) continue;

    // --- artist affinity ---
    const artistWeight =
      track.artists.reduce(
        (sum, artist) => sum + (artistWeights.get(artist) ?? 0),
        0
      ) / track.artists.length;

    // --- recency signal ---
    const recencyWeight = getRecencyWeight(addedAt);

    // --- composite score ---
    const score = artistWeight * 0.6 + recencyWeight * 0.4;

    // --- explainability ---
    const reasons: string[] = [];

    if (artistWeight > 0.15) {
      reasons.push(`You frequently add tracks by ${track.artists.join(", ")}`);
    }

    if (recencyWeight > 0.6) {
      reasons.push(`This playlist has recent activity in this style`);
    }

    // console.log("excluded", track.id);

    recommendations.push({
      trackId: track.id,
      score,
      reasons,
    });
  }

  // --- rank by affinity ---
  recommendations.sort((a, b) => b.score - a.score);

  // --- diversity constraint (artist cap) ---
  const artistCounts = new Map<string, number>();
  const diversified: Recommendation[] = [];

  for (const rec of recommendations) {
    const track = playlistTracks.find(
      (pt) => pt.track.id === rec.trackId
    )?.track;

    if (!track) continue;

    const primaryArtist = track.artists[0];
    const count = artistCounts.get(primaryArtist) ?? 0;

    if (count >= artistCap) continue;

    artistCounts.set(primaryArtist, count + 1);
    diversified.push(rec);

    if (diversified.length >= limit * 2) break;
  }

  // --- exploration injection ---
  const maxExplore = Math.floor(limit * exploreFraction);
  let exploreCount = 0;
  const results: Recommendation[] = [];

  for (const rec of diversified) {
    if (results.length >= limit) break;

    const shouldExplore =
      exploreCount < maxExplore && Math.random() < exploreRate;

    if (shouldExplore) {
      results.push({
        ...rec,
        isExploration: true,
        reasons: [
          ...rec.reasons,
          "Adding variety to avoid over-representing one artist",
        ],
      });
      exploreCount++;
    } else {
      results.push(rec);
    }
  }

  return results;
}
