import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORIES = [
  'Book',
  'Travel',
  'Fashion',
  'Movies & TV',
  'Home Décor & Art',
  'Food & Drink',
  'Online Courses',
  'Hobbies & Crafts',
  'Wellness',
  'Tech & Gadgets',
  'Cultural Events',
  'Podcasts',
  'Magazines',
  'Cultural Media'
];

const SYSTEM_PROMPT = `You are a cultural recommendation expert. Based on the user's detailed music preferences including genres, artists, tracks, playlists, and location, suggest a diverse range of cultural recommendations across these categories: ${CATEGORIES.join(', ')}. 

For each recommendation, provide:
- A specific title/place/item/experience name
- A 2-3 sentence explanation connecting it to their music taste and preferences
- A relevant URL for more information

Format as a JSON array with:
- 'type' (one of the categories listed above)
- 'title' (specific name)
- 'reason' (explanation)
- 'link' (URL)

Ensure recommendations are evenly distributed across all categories and deeply connected to their musical preferences.`;

serve(async (req) => {
  console.log('Function invoked with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { musicData, count = 14 } = await req.json();
    console.log('Received music data:', JSON.stringify(musicData));

    if (!musicData || !musicData.genres) {
      throw new Error('Invalid music data');
    }

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
            content: `Based on this user's music profile:
              - Genres: ${musicData.genres.join(', ')}
              - Favorite Artists: ${musicData.artists.join(', ')}
              - Top Tracks: ${musicData.tracks.map(t => `${t.name} by ${t.artist}`).join(', ')}
              - Playlists: ${musicData.playlists.join(', ')}
              - Location: ${musicData.country || 'Unknown'}
              - Recently Played: ${musicData.recentlyPlayed.join(', ')}

              Provide ${count} cultural recommendations (one for each category) that would deeply resonate with their taste.
              Ensure recommendations are specific and personally tailored to their musical preferences.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    let recommendations;
    try {
      recommendations = JSON.parse(data.choices[0].message.content);
      console.log('Parsed recommendations:', JSON.stringify(recommendations));
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Provide diverse fallback recommendations
      recommendations = CATEGORIES.map(category => ({
        type: category,
        title: `${musicData.genres[0]} Inspired ${category}`,
        reason: `A ${category.toLowerCase()} recommendation based on your interest in ${musicData.genres[0]} music.`,
        link: `https://www.google.com/search?q=${encodeURIComponent(musicData.genres[0])}+${encodeURIComponent(category)}`
      }));
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