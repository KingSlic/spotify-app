import { Track } from "@/types/track";
import { Playlist } from "@/types/playlist";

/**
 * Simulated recent activity
 */
export const recentlyPlayedPlaylistIds = ["3", "1", "2"];

/**
 * Tracks
 */
export const tracks: Track[] = [
  {
    id: "t1",
    title: "Blinding Lights",
    artists: ["The Weeknd"],
    album: "After Hours",
    duration: "3:20",
    image: "https://picsum.photos/300?random=101",
  },
  {
    id: "t2",
    title: "Save Your Tears",
    artists: ["The Weeknd"],
    album: "After Hours",
    duration: "3:36",
    image: "https://picsum.photos/300?random=102",
  },
  {
    id: "t3",
    title: "Passionfruit",
    artists: ["Drake"],
    album: "More Life",
    duration: "4:18",
    image: "https://picsum.photos/300?random=103",
  },
  {
    id: "t4",
    title: "Crew Love",
    artists: ["Drake", "The Weeknd"],
    album: "Take Care",
    duration: "3:28",
    image: "https://picsum.photos/300?random=104",
  },
];

/**
 * Playlists
 */
export const playlists: Playlist[] = [
  {
    id: "1",
    title: "Daily Mix 1",
    subtitle: "Made for Gerry",
    type: "mix",
    image: "https://picsum.photos/600?random=1",
    href: "/playlist/1",
    creator: "Spotify",
    trackIds: ["t1", "t2", "t3", "t4"],
  },
  {
    id: "2",
    title: "Daily Mix 2",
    subtitle: "Your weekly vibe",
    type: "mix",
    image: "https://picsum.photos/600?random=2",
    href: "/playlist/2",
    creator: "Spotify",
    trackIds: ["t2", "t3"],
  },
  {
    id: "3",
    title: "Daily Mix 3",
    subtitle: "Chill mode engaged",
    type: "mix",
    image: "https://picsum.photos/600?random=3",
    href: "/playlist/3",
    creator: "Spotify",
    trackIds: ["t1", "t4"],
  },
  {
    id: "4",
    title: "Focus Flow",
    subtitle: "Beats for deep work",
    type: "playlist",
    image: "https://picsum.photos/600?random=4",
    href: "/playlist/4",
    creator: "Spotify",
    trackIds: ["t3", "t4"],
  },
  {
    id: "5",
    title: "Liked Songs",
    subtitle: "Your saved tunes",
    type: "playlist",
    image: "https://misc.scdn.co/liked-songs/liked-songs-640.png",
    href: "/playlist/5",
    creator: "You",
    trackIds: ["t1", "t3"],
  },
  {
    id: "6",
    title: "Mood Booster",
    subtitle: "Feel-good hits",
    type: "playlist",
    image: "https://picsum.photos/600?random=6",
    href: "/playlist/6",
    creator: "Spotify",
    trackIds: ["t2", "t4"],
  },
];

/**
 * Home sections
 */
export const homeSections = [
  {
    id: "good-evening",
    title: "Good evening",
    playlistIds: ["1", "2", "3"],
  },
  {
    id: "made-for-you",
    title: "Made for you",
    playlistIds: ["4", "6"],
  },
  {
    id: "recently-played",
    title: "Recently played",
    dynamic: "recently-played",
  },
];

/**
 * Helpers
 */
export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id);
}

export function getTracksForPlaylist(playlistId: string): Track[] {
  const playlist = getPlaylistById(playlistId);
  if (!playlist) return [];

  return playlist.trackIds
    .map((trackId) => tracks.find((t) => t.id === trackId))
    .filter((t): t is Track => Boolean(t));
}

export function getHomeSections() {
  return homeSections;
}

export function getPlaylistsByIds(ids: string[]) {
  return ids
    .map((id) => playlists.find((p) => p.id === id))
    .filter(Boolean);
}

export function getRecentlyPlayedPlaylists() {
  return getPlaylistsByIds(recentlyPlayedPlaylistIds);
}
