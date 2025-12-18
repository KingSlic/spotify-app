import {
  playlists,
  recentlyPlayedPlaylistIds,
  getPlaylistsByIds, } from "./fakeDb";

export interface HomeSection {
  id: string;
  title: string;
  href?: string;
  playlists: typeof playlists;
}

export function getHomeSections(): HomeSection[] {
  return [
    {
      id: "good-evening",
      title: "Good Evening",
      playlists: playlists.slice(0, 6),
    },
    {
      id: "made-for-you",
      title: "Made for You",
      href: "/made-for-you",
      playlists: playlists.slice(6, 12),
    },
    {
      id: "recently-played",
      title: "Recently Played",
      playlists: getPlaylistsByIds(recentlyPlayedPlaylistIds),
    },
  ];
}
