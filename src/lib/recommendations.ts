import { supabase } from "@/integrations/supabase/client";

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
  recentlyPlayed: string[];
}

export const getRecommendations = async (musicData: MusicData, count = 14): Promise<Recommendation[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-recommendations', {
      body: { musicData, count },
    });

    if (error) throw error;
    return data.recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};