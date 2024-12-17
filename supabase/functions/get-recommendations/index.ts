import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a cultural recommendation expert. Based on the user's detailed music preferences, suggest highly personalized recommendations across various categories. Each recommendation must be unique and specific.

Analyze their complete musical profile including:
- All genres they listen to
- The full range of artists they enjoy
- The diversity in their playlists
- Their location for regional relevance
- The overall themes and patterns in their music taste

Ensure recommendations are evenly distributed across these categories:
- Books
- Travel destinations
- Fashion items
- Movies & TV shows
- Home décor & art
- Food & drink experiences
- Online courses
- Hobbies & crafts
- Wellness activities
- Tech & gadgets
- Cultural events
- Podcasts
- Magazines
- Cultural media

For each recommendation, provide:
1. A specific title/name
2. A detailed reason explaining how it connects to their musical preferences
3. A direct URL to access/purchase the item
4. The appropriate category from the list above

Make each recommendation unique and ensure they reflect different aspects of the user's musical taste.`;

serve(async (req) => {
  console.log('Get recommendations function invoked');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { musicData, count = 14 } = await req.json();
    console.log('Received music data:', JSON.stringify(musicData));

    if (!musicData || !musicData.genres || !musicData.artists) {
      throw new Error('Invalid music data provided');
    }

    // Create a rich musical profile analysis
    const genreAnalysis = musicData.genres.length > 0 
      ? `Your diverse taste in ${musicData.genres.join(', ')} shows an appreciation for ${musicData.genres.length > 1 ? 'multiple musical traditions' : 'this specific musical tradition'}.`
      : '';
    
    const artistAnalysis = musicData.artists.length > 0
      ? `You follow artists like ${musicData.artists.join(', ')}, indicating an interest in various musical styles and perspectives.`
      : '';

    const trackAnalysis = musicData.tracks?.length > 0
      ? `Your top tracks include ${musicData.tracks.map(t => `${t.name} by ${t.artist}`).join(', ')}, showing your specific music preferences.`
      : '';

    const playlistAnalysis = musicData.playlists?.length > 0
      ? `Your playlists like ${musicData.playlists.join(', ')} suggest curated music experiences that matter to you.`
      : '';

    const locationContext = musicData.country
      ? `Being based in ${musicData.country} might influence your cultural preferences.`
      : '';

    console.log('Sending request to OpenAI with musical profile');
    
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

              Generate ${count} unique cultural recommendations that would deeply resonate with this musical identity.
              Ensure recommendations are evenly distributed across all categories.
              Each recommendation must be specific and include a direct URL.`
          }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    let recommendations;
    try {
      recommendations = JSON.parse(data.choices[0].message.content);
      console.log('Parsed recommendations:', JSON.stringify(recommendations));
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