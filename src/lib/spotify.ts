import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const CLIENT_ID = "45c6b39dac50487b8fadc3a6b2592479";
const REDIRECT_URI = window.location.href.includes('localhost') 
  ? 'http://localhost:8080'
  : 'https://preview--cultural-chroma.lovable.app';
const SCOPES = [
  "user-read-private",
  "user-top-read",
  "playlist-read-private",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-read-currently-playing",
  "user-read-recently-played"  // Added this scope
];

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
    const response = await spotifyApi.currentUser.topItems("artists", "medium_term", 20);
    console.log('Top artists response:', response);
    return response.items;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};

export const getTopTracks = async () => {
  try {
    console.log('Fetching top tracks...');
    const response = await spotifyApi.currentUser.topItems("tracks", "medium_term", 20);
    console.log('Top tracks response:', response);
    return response.items;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
};

export const getUserPlaylists = async () => {
  try {
    console.log('Fetching user playlists...');
    const response = await spotifyApi.playlists.getUsersPlaylists(undefined, 20);
    console.log('User playlists response:', response);
    return response.items;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    console.log('Fetching user profile...');
    const response = await spotifyApi.currentUser.profile();
    console.log('User profile response:', response);
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const getRecentlyPlayed = async () => {
  try {
    console.log('Fetching recently played tracks...');
    const response = await spotifyApi.player.getRecentlyPlayedTracks(20);
    console.log('Recently played response:', response);
    return response.items;
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    throw error;
  }
};