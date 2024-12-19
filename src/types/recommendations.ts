export interface Recommendation {
  type: string;
  title: string;
  reason: string;
  link: string;
}

export interface MusicData {
  genres: string[];
  artists: string[];
  tracks: Array<{ name: string; artist: string; }>;
  playlists: string[];
  country?: string;
}