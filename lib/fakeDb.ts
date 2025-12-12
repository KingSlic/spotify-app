
import { Track } from "@/types/track";
import { Playlist } from "@/types/playlist";

/**
 * Global track pool
 * (You can add more later – this is enough to power demos + CRUD.)
 */


// Simulated recent activity (most recent first)
export const recentlyPlayedPlaylistIds = [
  "3",
  "1",
  "2",
];


export const tracks: Track[] = [
  {
    id: "t1",
    title: "Blinding Lights",
    artists: ["The Weeknd"],
    album: "After Hours",
    duration: "3:20",
    image: "https://i.scdn.co/image/ab67616d0000b273d56e5e1c0f9b5e6e1d2e5f4a",
  },
  {
    id: "t2",
    title: "Save Your Tears",
    artists: ["The Weeknd"],
    album: "After Hours",
    duration: "3:36",
    image: "https://i.scdn.co/image/ab67616d0000b273d56e5e1c0f9b5e6e1d2e5f4a",
  },
  {
    id: "t3",
    title: "Passionfruit",
    artists: ["Drake"],
    album: "More Life",
    duration: "4:18",
    image: "https://i.scdn.co/image/ab67616d0000b2734d33be3e2b061f6f52adf0f3",
  },
  {
    id: "t4",
    title: "Crew Love",
    artists: ["Drake", "The Weeknd"],
    album: "Take Care",
    duration: "3:28",
    image: "https://i.scdn.co/image/ab67616d0000b273dfedae3a40add3521dc1a9f5",
  },
  {
    id: "t5",
    title: "Madiba Riddim",
    artists: ["Drake"],
    album: "More Life",
    duration: "3:25",
    image: "https://i.scdn.co/image/ab67616d0000b2734d33be3e2b061f6f52adf0f3",
  },
  {
    id: "t6",
    title: "Essence (feat. Tems)",
    artists: ["Wizkid", "Tems"],
    album: "Made in Lagos",
    duration: "4:09",
    image: "https://i.scdn.co/image/ab67616d0000b2731b02c1b3b2bb3d47a7a2ad7a",
  },
  {
    id: "t7",
    title: "Last Last",
    artists: ["Burna Boy"],
    album: "Love, Damini",
    duration: "2:53",
    image: "https://i.scdn.co/image/ab67616d0000b2734b50a648153114f0c4b267af",
  },
  {
    id: "t8",
    title: "Calm Down",
    artists: ["Rema"],
    album: "Rave & Roses",
    duration: "3:39",
    image: "https://i.scdn.co/image/ab67616d0000b273e01da9a4a284c08bd9e4a1ba",
  },
  {
    id: "t9",
    title: "Nights",
    artists: ["Frank Ocean"],
    album: "Blonde",
    duration: "5:07",
    image: "https://i.scdn.co/image/ab67616d0000b2738c82f91ac2f3e2f63bf7b66b",
  },
  {
    id: "t10",
    title: "Pink + White",
    artists: ["Frank Ocean"],
    album: "Blonde",
    duration: "3:04",
    image: "https://i.scdn.co/image/ab67616d0000b2738c82f91ac2f3e2f63bf7b66b",
  },
  {
    id: "t11",
    title: "Love Galore",
    artists: ["SZA", "Travis Scott"],
    album: "Ctrl",
    duration: "4:35",
    image: "https://i.scdn.co/image/ab67616d0000b273d5e8d3d8df23883228c166a8",
  },
  {
    id: "t12",
    title: "The Weekend",
    artists: ["SZA"],
    album: "Ctrl",
    duration: "4:32",
    image: "https://i.scdn.co/image/ab67616d0000b273d5e8d3d8df23883228c166a8",
  },
  {
    id: "t13",
    title: "Untitled 07 | 2014–2016",
    artists: ["Kendrick Lamar"],
    album: "untitled unmastered.",
    duration: "8:16",
    image: "https://i.scdn.co/image/ab67616d0000b27350f4d067f7edb41a136e2e2a",
  },
  {
    id: "t14",
    title: "Money Trees",
    artists: ["Kendrick Lamar", "Jay Rock"],
    album: "good kid, m.A.A.d city",
    duration: "6:27",
    image: "https://i.scdn.co/image/ab67616d0000b2730b4374f1c1ff717a8ba4a01f",
  },
  {
    id: "t15",
    title: "God's Plan",
    artists: ["Drake"],
    album: "Scorpion",
    duration: "3:19",
    image: "https://i.scdn.co/image/ab67616d0000b2733a41d1a5d65704fbf6f5d8c8",
  },
  {
    id: "t16",
    title: "Sicko Mode",
    artists: ["Travis Scott", "Drake"],
    album: "ASTROWORLD",
    duration: "5:12",
    image: "https://i.scdn.co/image/ab67616d0000b273b2745078e1bc105b956cc8e8",
  },
];

/**
 * Playlists
 * These IDs can be used by your home sections + /playlist/[id] route.
 * You can add more playlists or change titles later.
 */
export const playlists: Playlist[] = [
  // 1–6: Good Evening style mixes
  {
    id: "1",
    title: "Daily Mix 1",
    subtitle: "Made for Gerry",
    type: "mix",
    image: "https://i.scdn.co/image/ab67706f0000000278b7f5cb0b4cbea7f2a7bc01",
    href: "/playlist/1",
    creator: "Spotify",
    trackIds: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"],
  },
  {
    id: "2",
    title: "Daily Mix 2",
    subtitle: "Your weekly vibe",
    type: "mix",
    image: "https://i.scdn.co/image/ab67706f000000029c9b5f0b776bb06e5a4b4b10",
    href: "/playlist/2",
    creator: "Spotify",
    trackIds: ["t3", "t4", "t5", "t9", "t10", "t11", "t12", "t15"],
  },
  {
    id: "3",
    title: "Daily Mix 3",
    subtitle: "Chill mode engaged",
    type: "mix",
    image: "https://i.scdn.co/image/ab67706f000000023cfa6c5c1d2b5602eb5b40aa",
    href: "/playlist/3",
    creator: "Spotify",
    trackIds: ["t8", "t9", "t10", "t11", "t12", "t1", "t2", "t3"],
  },
  {
    id: "4",
    title: "Focus Flow",
    subtitle: "Beats for deep work",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f000000028f31e8c7c9a0b13cd6ae8b4e",
    href: "/playlist/4",
    creator: "Spotify",
    trackIds: ["t5", "t6", "t7", "t8", "t9", "t10", "t13", "t14"],
  },
  {
    id: "5",
    title: "Liked Songs",
    subtitle: "Your saved tunes",
    type: "playlist",
    image: "https://misc.scdn.co/liked-songs/liked-songs-640.png",
    href: "/playlist/5",
    creator: "You",
    trackIds: ["t1", "t3", "t6", "t9", "t11", "t13", "t15", "t16"],
  },
  {
    id: "6",
    title: "Mood Booster",
    subtitle: "Feel-good hits",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f000000029d9312e64042fbaa2ee5cc5b",
    href: "/playlist/6",
    creator: "Spotify",
    trackIds: ["t1", "t2", "t6", "t7", "t8", "t15", "t16"],
  },

  // 7–12: Made For You / Discover
  {
    id: "7",
    title: "Discover Weekly",
    subtitle: "New music just for you",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f000000024cda9e5078e1bc39979f68de",
    href: "/playlist/7",
    creator: "Spotify",
    trackIds: ["t3", "t4", "t5", "t9", "t10", "t11", "t14", "t15"],
  },
  {
    id: "8",
    title: "Release Radar",
    subtitle: "Fresh tracks from artists you love",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f0000000240742ff9e59c779843f38e35",
    href: "/playlist/8",
    creator: "Spotify",
    trackIds: ["t1", "t2", "t6", "t7", "t8", "t15", "t16"],
  },
  {
    id: "9",
    title: "Daily Mix 4",
    subtitle: "More of what you like",
    type: "mix",
    image: "https://i.scdn.co/image/ab67706f0000000268cc6a9ae5c3ad0fb70d1373",
    href: "/playlist/9",
    creator: "Spotify",
    trackIds: ["t9", "t10", "t11", "t12", "t13", "t14"],
  },
  {
    id: "10",
    title: "Made for Gerry",
    subtitle: "Personalized blend",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f0000000241e50637e2b2fc90d1c8e0f2",
    href: "/playlist/10",
    creator: "Spotify",
    trackIds: ["t1", "t3", "t5", "t7", "t9", "t11", "t13", "t15"],
  },
  {
    id: "11",
    title: "Chill Mix",
    subtitle: "Soft and mellow",
    type: "mix",
    image: "https://i.scdn.co/image/ab67706f00000002a2d36c9c57bde74e6a1fde37",
    href: "/playlist/11",
    creator: "Spotify",
    trackIds: ["t8", "t9", "t10", "t11", "t12"],
  },
  {
    id: "12",
    title: "Energy Mix",
    subtitle: "Keep your energy up",
    type: "mix",
    image: "https://i.scdn.co/image/ab67706f00000002df0fb12b9f0e2d8f2baafba7",
    href: "/playlist/12",
    creator: "Spotify",
    trackIds: ["t1", "t2", "t6", "t7", "t15", "t16"],
  },

  // 13–18: Your Playlists
  {
    id: "13",
    title: "Gym Essentials",
    subtitle: "Pump-up hits",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f00000002c465d174a264a3ae59a1c5b7",
    href: "/playlist/13",
    creator: "Gerry",
    trackIds: ["t1", "t2", "t6", "t7", "t15", "t16"],
  },
  {
    id: "14",
    title: "Chill Vibes",
    subtitle: "Laid-back energy",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f00000002d8ebf2f72db53f5a68bbf64c",
    href: "/playlist/14",
    creator: "Gerry",
    trackIds: ["t8", "t9", "t10", "t11", "t12"],
  },
  {
    id: "15",
    title: "Throwback Jams",
    subtitle: "Your nostalgic favorites",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f000000026ce8da8b3689464d3e9d8cb6",
    href: "/playlist/15",
    creator: "Gerry",
    trackIds: ["t3", "t4", "t14", "t15"],
  },
  {
    id: "16",
    title: "Afrobeats Mix",
    subtitle: "Rhythms from across the continent",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f000000028b29b41fbe035c21075c841a",
    href: "/playlist/16",
    creator: "Gerry",
    trackIds: ["t6", "t7", "t8"],
  },
  {
    id: "17",
    title: "Instrumental Focus",
    subtitle: "No lyrics. Just flow.",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f000000024c4a17adefaf77a3d8a8fa40",
    href: "/playlist/17",
    creator: "Gerry",
    trackIds: ["t5", "t9", "t10"],
  },
  {
    id: "18",
    title: "R&B Nights",
    subtitle: "Smooth late-night vibes",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f00000002e0f9cace35cf1aaba3a09975",
    href: "/playlist/18",
    creator: "Gerry",
    trackIds: ["t9", "t10", "t11", "t12"],
  },

  // 21–26: Recently Played–style
  {
    id: "21",
    title: "After Hours",
    subtitle: "The Weeknd",
    type: "album",
    image: "https://i.scdn.co/image/ab67616d0000b273d56e5e1c0f9b5e6e1d2e5f4a",
    href: "/playlist/21",
    creator: "The Weeknd",
    trackIds: ["t1", "t2"],
  },
  {
    id: "22",
    title: "2010s Throwback",
    subtitle: "Playlist",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f00000002829e14da3a7a3e3aa527969b",
    href: "/playlist/22",
    creator: "Spotify",
    trackIds: ["t3", "t4", "t14", "t15", "t16"],
  },
  {
    id: "23",
    title: "Drake Radio",
    subtitle: "Artist Radio",
    type: "radio",
    image: "https://i.scdn.co/image/ab67706f00000002cb5be0f8b1e9a248f4782550",
    href: "/playlist/23",
    creator: "Spotify",
    trackIds: ["t3", "t4", "t5", "t15"],
  },
  {
    id: "24",
    title: "Certified Lover Boy",
    subtitle: "Drake",
    type: "album",
    image: "https://i.scdn.co/image/ab67616d0000b2733a41d1a5d65704fbf6f5d8c8",
    href: "/playlist/24",
    creator: "Drake",
    trackIds: ["t15"],
  },
  {
    id: "25",
    title: "Afrobeats Hits",
    subtitle: "Playlist",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f000000020f3221c5c678ac2b5014a4f4",
    href: "/playlist/25",
    creator: "Spotify",
    trackIds: ["t6", "t7", "t8"],
  },
  {
    id: "26",
    title: "R&B Now",
    subtitle: "Playlist",
    type: "playlist",
    image: "https://i.scdn.co/image/ab67706f00000002e8ce7a0e317037bb7ee2343d",
    href: "/playlist/26",
    creator: "Spotify",
    trackIds: ["t9", "t10", "t11", "t12"],
  },
];


export const homeSections = [
  {
    id: "good-evening",
    title: "Good evening",
    playlistIds: ["1", "2", "3"],
  },
  {
    id: "made-for-you",
    title: "Made for you",
    playlistIds: ["1", "2"],
  },
  {
    id: "recently-played",
    title: "Recently played",
    dynamic: "recently-played"
  },
];



/** Helper: find a playlist by ID */
export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id);
}

/** Helper: get all tracks for a playlist */
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
