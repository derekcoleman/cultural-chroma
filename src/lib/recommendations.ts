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
}

export const getRecommendations = async (
  musicData: MusicData, 
  count = 14,
  previousRecommendations: Recommendation[] = [],
  selectedCategory?: string
): Promise<Recommendation[]> => {
  try {
    // Get user's preferred categories
    const { data: { user } } = await supabase.auth.getUser();
    let preferredCategories: string[] = [];
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_categories')
        .eq('id', user.id)
        .single();
      
      if (profile?.preferred_categories) {
        preferredCategories = profile.preferred_categories;
      }
    }

    const { data, error } = await supabase.functions.invoke('get-recommendations', {
      body: { 
        musicData, 
        count,
        previousRecommendations,
        selectedCategory,
        preferredCategories
      },
    });

    if (error) throw error;
    return data.recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};