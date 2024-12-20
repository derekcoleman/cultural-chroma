export const createShareText = (nickname: string, genres: string[], artistCount: number, genreCount: number) => {
  const topGenres = genres.slice(0, 3).join(", ");
  return encodeURIComponent(
    `🎵 I'm a "${nickname}" according to my cultural profile!\n\nMy journey spans ${artistCount} artists and ${genreCount} genres, with a focus on ${topGenres}.\n\nDiscover your cultural identity at culturalprofile.app 🎧`
  );
};