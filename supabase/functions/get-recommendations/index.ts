import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a sophisticated cultural recommendation expert with deep knowledge of music and its connections to broader culture. Your task is to analyze a user's complete musical profile in detail and provide highly personalized, UNIQUE recommendations across various cultural domains.

When providing recommendations:
1. NEVER repeat previous recommendations
2. Ensure each recommendation is UNIQUE and specifically tailored to different aspects of the user's taste
3. Draw deep connections between their musical preferences and the recommendations
4. Consider the user's location and cultural context
5. Provide specific, actionable recommendations with real links
6. Analyze patterns across genres, artists, and listening habits to identify underlying preferences

Format your response as a JSON array of objects, each with:
- 'type' (specific category)
- 'title' (specific name/place/item)
- 'reason' (2-3 sentences explaining the deep connection to their musical profile)
- 'link' (direct URL to explore/purchase)

IMPORTANT: Each recommendation must be completely different from any previous ones, exploring new angles of their musical identity.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { musicData, previousRecommendations = [] } = await req.json();
    console.log('Processing request for new recommendations');
    console.log('Previous recommendations count:', previousRecommendations.length);

    // Create a comprehensive musical profile analysis
    const genreAnalysis = musicData.genres.length > 0 
      ? `Your diverse taste in ${musicData.genres.join(', ')} shows an appreciation for ${musicData.genres.length > 1 ? 'multiple musical traditions' : 'this specific musical tradition'}.`
      : '';
    
    const artistAnalysis = musicData.artists.length > 0
      ? `You follow artists like ${musicData.artists.join(', ')}, indicating an interest in various musical styles and perspectives.`
      : '';

    const trackAnalysis = musicData.tracks.length > 0
      ? `Your top tracks include ${musicData.tracks.map(t => `${t.name} by ${t.artist}`).join(', ')}, showing your specific music preferences.`
      : '';

    const playlistAnalysis = musicData.playlists.length > 0
      ? `Your playlists like ${musicData.playlists.join(', ')} suggest curated music experiences that matter to you.`
      : '';

    const locationContext = musicData.country
      ? `Being based in ${musicData.country} might influence your cultural preferences.`
      : '';

    // Add previous recommendations to avoid duplicates
    const previousTitles = previousRecommendations.map(r => r.title.toLowerCase());
    const avoidList = `IMPORTANT: Do NOT recommend anything similar to these previous recommendations: ${previousTitles.join(', ')}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { 
            role: 'user', 
            content: `Based on this detailed musical profile:

              ${genreAnalysis}
              ${artistAnalysis}
              ${trackAnalysis}
              ${playlistAnalysis}
              ${locationContext}
              ${avoidList}

              Provide 15 NEW and UNIQUE cultural recommendations that would deeply resonate with this musical identity.
              Ensure each recommendation explores a different aspect of their taste and is NOT similar to previous recommendations.`
          }
        ],
        temperature: 0.9, // Increased for more variety
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully generated new recommendations');
    
    let recommendations = [];
    try {
      recommendations = JSON.parse(data.choices[0].message.content);
      console.log('Number of new recommendations:', recommendations.length);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Failed to parse recommendations');
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-recommendations function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Please check the function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});