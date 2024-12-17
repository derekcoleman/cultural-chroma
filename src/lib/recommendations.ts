import { supabase } from "@/integrations/supabase/client";

export interface Recommendation {
  type: string;
  title: string;
  reason: string;
  link: string;
}

export const getRecommendations = async (genres: string[], count = 4): Promise<Recommendation[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-recommendations', {
      body: { genres, count },
    });

    if (error) throw error;
    return data.recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};