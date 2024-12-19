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

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

export const getRecommendations = async (
  musicData: MusicData, 
  count = 14,
  previousRecommendations: Recommendation[] = [],
  selectedCategory?: string
): Promise<Recommendation[]> => {
  try {
    // Get user's preferred categories
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if we have cached recommendations
    const { data: cachedData } = await supabase
      .from('cached_recommendations')
      .select('recommendations, created_at')
      .eq('user_id', user.id)
      .single();

    // If we have valid cached data and no specific category is selected
    if (cachedData && !selectedCategory) {
      const cacheAge = Date.now() - new Date(cachedData.created_at).getTime();
      if (cacheAge < CACHE_DURATION) {
        console.log('Using cached recommendations');
        return cachedData.recommendations;
      }
    }

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

    // Cache the new recommendations if no specific category was requested
    if (!selectedCategory) {
      await supabase
        .from('cached_recommendations')
        .upsert({
          user_id: user.id,
          recommendations: data.recommendations,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    }

    return data.recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};