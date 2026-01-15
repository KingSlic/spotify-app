type Track = {
  id: string;
  title: string;
  artists: string[];
};

type Recommendation = {
  track: Track;
  reason: string;
};

export function rankTracksWithReasons(
  tracks: Track[],
  options?: {
    excludeTrackIds?: Set<string>;
    limit?: number;
  }
): Recommendation[] {
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return [];
  }

  // 🔒 Never recommend tracks already in the playlist
  const exclude =
    options?.excludeTrackIds ??
    new Set(tracks.map((track) => track.id));

  // Count artist frequency
  const artistCounts = new Map<string, number>();

  for (const track of tracks) {
    if (!Array.isArray(track.artists)) continue;

    for (const artist of track.artists) {
      artistCounts.set(artist, (artistCounts.get(artist) ?? 0) + 1);
    }
  }

  // Score tracks by artist familiarity
  const scored = tracks
    .filter((track) => !exclude.has(track.id))
    .map((track) => {
      const score = track.artists.reduce(
        (sum, artist) => sum + (artistCounts.get(artist) ?? 0),
        0
      );

      return {
        track,
        score,
        reason: "Because you listen to similar artists",
      };
    });

  scored.sort((a, b) => b.score - a.score);

  return scored
    .slice(0, options?.limit ?? 10)
    .map(({ track, reason }) => ({ track, reason }));
}
