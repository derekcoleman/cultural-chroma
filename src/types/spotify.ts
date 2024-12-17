export interface Artist {
  name: string;
  genres: string[];
  id?: string;
}

export interface SimplifiedArtist {
  name: string;
  genres?: string[];  // Make genres optional since track artists might not have genres
  id?: string;
}