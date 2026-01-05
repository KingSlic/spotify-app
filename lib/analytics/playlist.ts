interface Track {
  id: string;
  artists: string[];
}

interface PlaylistTrack {
  track: Track;
  addedAt: number;
}

export function getRecentlyAdded(playlistTracks: PlaylistTrack[], limit = 5) {
  return [...playlistTracks]
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, limit)
    .map((pt) => pt.track);
}

export function getArtistCounts(tracks: Track[]) {
  const counts = new Map<string, number>();

  for (const track of tracks) {
    for (const artist of track.artists) {
      counts.set(artist, (counts.get(artist) ?? 0) + 1);
    }
  }

  return counts;
}

export function getTopArtists(counts: Map<string, number>, limit = 3) {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export function getArtistPreferenceWeights(counts: Map<string, number>) {
  const total = [...counts.values()].reduce((a, b) => a + b, 0);

  const weights = new Map<string, number>();

  for (const [artist, count] of counts.entries()) {
    weights.set(artist, count / total);
  }

  return weights;
}


const DAY = 1000 * 60 * 60 * 24;

export function getRecencyWeight(
  addedAt: number,
  now = Date.now(),
  halfLifeDays = 30
) {
  const ageInDays = (now - addedAt) / DAY;
  const decay = Math.pow(0.5, ageInDays / halfLifeDays);
  return decay;
}

export function getRecencyWeights(
  playlistTracks: PlaylistTrack[]
) {
  const weights = new Map<string, number>()

  for (const { track, addedAt } of playlistTracks) {
    const weight = getRecencyWeight(addedAt)
    weights.set(track.id, weight)
  }

  return weights
}

export function getTrackAffinityScores(
  playlistTracks: PlaylistTrack[],
  artistWeights: Map<string, number>,
  options?: {
    artistBias?: number
    recencyBias?: number
  }
) {
  const {
    artistBias = 0.6,
    recencyBias = 0.4,
  } = options ?? {}

  const scores = new Map<string, number>()

  for (const { track, addedAt } of playlistTracks) {
    const artistWeight =
      track.artists.reduce(
        (sum, artist) => sum + (artistWeights.get(artist) ?? 0),
        0
      ) / track.artists.length

    const recencyWeight = getRecencyWeight(addedAt)

    const score =
      artistWeight * artistBias +
      recencyWeight * recencyBias

    scores.set(track.id, score)
  }

  return scores
}
