
export type PlaylistKind = "playlist" | "album" | "mix" | "radio";

export interface Playlist {
  id: string;
  title: string;
  subtitle?: string;
  type: PlaylistKind;
  image: string;
  href: `/playlists/${string}`
  creator?: string;
  trackIds: string[]; // references Track.id
}
