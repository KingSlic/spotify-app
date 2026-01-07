import { getRecencyWeight } from "../analytics/playlist";

export interface Recommendation {
  trackId: string;
  score: number;
  reasons: string[];
  isExploration?: boolean;
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
    artistCap?: number;
  }
): Recommendation[] {

  // 🔒 Policy defaults (self-contained)
  const artistCap = options?.artistCap ?? 2;
  const exploreRate = options?.exploreRate ?? 0;
  const exploreFraction = options?.exploreFraction ?? 0;

  // 🔒 Policy invariant: never recommend already-included tracks
  const includedTrackIds = new Set(
    playlistTracks.map((pt) => pt.track.id)
  );

  const exclude = options?.excludeTrackIds ?? includedTrackIds;

  const recommendations: Recommendation[] = [];

  for (const { track, addedAt } of playlistTracks) {
    if (exclude.has(track.id)) continue;

    const artistWeight =
      track.artists.reduce(
        (sum, artist) => sum + (artistWeights.get(artist) ?? 0),
        0
      ) / track.artists.length;

    const recencyWeight = getRecencyWeight(addedAt);
    const score = artistWeight * 0.6 + recencyWeight * 0.4;

    const reasons: string[] = [];

    if (artistWeight > 0.15) {
      reasons.push(`You frequently add tracks by ${track.artists.join(", ")}`);
    }

    if (recencyWeight > 0.6) {
      reasons.push(`This playlist has recent activity in this style`);
    }

    recommendations.push({ trackId: track.id, score, reasons });
  }

  recommendations.sort((a, b) => b.score - a.score);

  const artistCounts = new Map<string, number>();
  const diversified: Recommendation[] = [];

  for (const rec of recommendations) {
    const track = playlistTracks.find(
      (pt) => pt.track.id === rec.trackId
    )?.track;

    if (!track) continue;

    const artist = track.artists[0];
    const count = artistCounts.get(artist) ?? 0;

    if (count >= artistCap) continue;

    artistCounts.set(artist, count + 1);
    diversified.push(rec);

    if (diversified.length >= limit * 2) break;
  }

  const maxExplore = Math.floor(limit * exploreFraction);
  let exploreCount = 0;
  const results: Recommendation[] = [];

  for (const rec of diversified) {
    if (results.length >= limit) break;

    const shouldExplore =
      exploreCount < maxExplore && Math.random() < exploreRate;

    results.push(
      shouldExplore
        ? {
            ...rec,
            isExploration: true,
            reasons: [
              ...rec.reasons,
              "Adding variety to avoid over-representing one artist",
            ],
          }
        : rec
    );

    if (shouldExplore) exploreCount++;
  }

  return results;
}
