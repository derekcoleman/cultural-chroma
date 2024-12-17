import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const CLIENT_ID = "1db05c2b3a9f4d6e8f0c2d4a6b8e0f9d"; // This is a public client ID
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