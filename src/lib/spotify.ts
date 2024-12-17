import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// This is a public client ID specifically for this app
const CLIENT_ID = "45c6b39dac50487b8fadc3a6b2592479";
const REDIRECT_URI = window.location.href.includes('localhost') 
  ? 'http://localhost:8080/'
  : 'https://preview--cultural-chroma.lovable.app/';
const SCOPES = ["user-read-private", "user-top-read"];

console.log('Spotify Configuration:', {
  CLIENT_ID,
  REDIRECT_URI,
  SCOPES,
  'Current URL': window.location.href
});

export const spotifyApi = SpotifyApi.withUserAuthorization(
  CLIENT_ID,
  REDIRECT_URI,
  SCOPES
);

export const getTopArtists = async () => {
  try {
    console.log('Fetching top artists...');
    const response = await spotifyApi.currentUser.topItems("artists", "medium_term", 10);
    console.log('Top artists response:', response);
    return response.items;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};