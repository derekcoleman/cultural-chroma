interface ProfileSummaryProps {
  nickname: string;
  artistCount: number;
  trackCount: number;
  topGenres: string[];
}

export const ProfileSummary = ({ nickname, artistCount, trackCount, topGenres }: ProfileSummaryProps) => {
  if (topGenres.length === 0) return "Start adding music to see your cultural profile";
  
  return `You're a "${nickname}" with ${artistCount} artists and ${trackCount} tracks, spanning genres like ${topGenres.join(", ")}`;
};