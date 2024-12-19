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
7. If preferred categories are provided, prioritize those categories in recommendations
8. If a specific category is selected, ONLY provide recommendations from that category

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
    console.log('Starting get-recommendations function');

    if (!openAIApiKey) {
      console.error('OpenAI API key is not set');
      throw new Error('OpenAI API key is not configured');
    }

    const { 
      musicData, 
      previousRecommendations = [], 
      count = 15,
      selectedCategory,
      preferredCategories = []
    } = await req.json();
    
    console.log('Received request with:', {
      genres: musicData?.genres?.length,
      artists: musicData?.artists?.length,
      tracks: musicData?.tracks?.length,
      previousRecommendations: previousRecommendations?.length,
      requestedCount: count,
      selectedCategory,
      preferredCategories
    });

    if (!musicData || !musicData.genres || !musicData.artists || !musicData.tracks) {
      throw new Error('Invalid music data structure provided');
    }

    // Create a comprehensive musical profile analysis
    const genreAnalysis = musicData.genres.length > 0 
      ? `Your diverse taste in ${musicData.genres.join(', ')} shows an appreciation for ${musicData.genres.length > 1 ? 'multiple musical traditions' : 'this specific musical tradition'}.`
      : 'No genre information available.';
    
    const artistAnalysis = musicData.artists.length > 0
      ? `You follow artists like ${musicData.artists.join(', ')}, indicating an interest in various musical styles and perspectives.`
      : 'No artist information available.';

    const trackAnalysis = musicData.tracks.length > 0
      ? `Your top tracks include ${musicData.tracks.map(t => `${t.name} by ${t.artist}`).join(', ')}, showing your specific music preferences.`
      : 'No track information available.';

    const playlistAnalysis = musicData.playlists?.length > 0
      ? `Your playlists like ${musicData.playlists.join(', ')} suggest curated music experiences that matter to you.`
      : 'No playlist information available.';

    const locationContext = musicData.country
      ? `Being based in ${musicData.country} might influence your cultural preferences.`
      : '';

    const previousTitles = previousRecommendations.map(r => r.title.toLowerCase());
    const avoidList = previousTitles.length > 0
      ? `IMPORTANT: Do NOT recommend anything similar to these previous recommendations: ${previousTitles.join(', ')}`
      : '';

    const categoryContext = selectedCategory
      ? `IMPORTANT: ONLY provide recommendations in the ${selectedCategory} category.`
      : preferredCategories.length > 0
      ? `Prioritize recommendations in these categories: ${preferredCategories.join(', ')}`
      : '';

    console.log('Making OpenAI API request');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
              ${categoryContext}
              ${avoidList}

              Provide ${count} NEW and UNIQUE cultural recommendations that would deeply resonate with this musical identity.
              ${selectedCategory ? `Remember: ONLY provide recommendations in the ${selectedCategory} category.` : ''}
              Ensure each recommendation explores a different aspect of their taste and is NOT similar to previous recommendations.`
          }
        ],
        temperature: 1.0,
      }),
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      console.log('Raw response:', responseText);
      throw new Error('Invalid response from OpenAI API');
    }

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(data)}`);
    }

    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response structure:', data);
      throw new Error('Unexpected response structure from OpenAI API');
    }

    console.log('Successfully received OpenAI response');
    
    let recommendations = [];
    try {
      recommendations = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed recommendations:', recommendations.length);
      
      if (!Array.isArray(recommendations)) {
        throw new Error('Recommendations must be an array');
      }
      
      // Validate recommendation structure
      recommendations.forEach((rec, index) => {
        if (!rec.type || !rec.title || !rec.reason || !rec.link) {
          throw new Error(`Invalid recommendation structure at index ${index}`);
        }
      });
      
    } catch (parseError) {
      console.error('Failed to parse recommendations:', parseError);
      console.log('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse recommendations from OpenAI response');
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
        details: 'Check the function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});