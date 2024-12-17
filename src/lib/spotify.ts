import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// This is a public client ID specifically for this app
const CLIENT_ID = "your-client-id-here"; // You'll need to replace this
const REDIRECT_URI = window.location.origin + "/dashboard";

export const spotifyApi = SpotifyApi.withUserAuthorization(
  CLIENT_ID,
  REDIRECT_URI,
  ["user-read-private", "user-top-read"]
);

export const getTopArtists = async () => {
  try {
    const response = await spotifyApi.currentUser.topItems("artists", "medium_term", 10);
    return response.items;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return [];
  }
};