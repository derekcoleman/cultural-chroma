import { supabase } from "@/integrations/supabase/client";
import type { Recommendation, MusicData } from "@/types/recommendations";
import type { Json } from "@/integrations/supabase/types";

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

export const getRecommendations = async (
  musicData: MusicData, 
  count = 14,
  previousRecommendations: Recommendation[] = [],
  selectedCategory?: string
): Promise<Recommendation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if we have cached recommendations
    const { data: cachedData } = await supabase
      .from('cached_recommendations')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // If we have valid cached data and no specific category is selected
    if (cachedData && !selectedCategory) {
      const cacheAge = Date.now() - new Date(cachedData.created_at).getTime();
      if (cacheAge < CACHE_DURATION) {
        console.log('Using cached recommendations');
        return cachedData.recommendations as unknown as Recommendation[];
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

    const recommendations = data.recommendations as Recommendation[];

    // Cache the new recommendations if no specific category was requested
    if (!selectedCategory) {
      const { error: upsertError } = await supabase
        .from('cached_recommendations')
        .upsert({
          user_id: user.id,
          recommendations: recommendations as unknown as Json,
        });

      if (upsertError) {
        console.error('Error caching recommendations:', upsertError);
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};