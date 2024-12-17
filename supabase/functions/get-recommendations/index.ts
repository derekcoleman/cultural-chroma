import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a cultural recommendation expert. Based on the user's COMPLETE musical profile, provide highly personalized recommendations across various categories.

Analyze their ENTIRE musical identity including:
- ALL genres they listen to (not just top ones)
- The FULL range of artists in their profile
- ALL their playlist names and themes
- Their geographic location
- The overall patterns and themes in their music taste

For each recommendation:
1. It MUST be a real, existing item/place/experience
2. It MUST have a direct URL to the specific item (not search results)
3. It MUST connect to multiple aspects of their musical profile
4. Each recommendation should be UNIQUE (never repeat recommendations)

Provide an EQUAL number of recommendations across these categories:
- Books (specific titles on Amazon/Goodreads)
- Travel Destinations (specific locations/experiences)
- Fashion (specific clothing items on major retailers)
- Movies & TV Shows (specific shows/films on streaming platforms)
- Home Décor & Art (specific items that match their musical aesthetic)
- Food & Drink (specific establishments/products)
- Online Courses (specific courses on platforms like Coursera/Udemy)
- Hobbies & Crafts (specific kits/supplies)
- Wellness (specific programs/products)
- Tech & Gadgets (specific products)
- Cultural Events (specific upcoming events)
- Podcasts (specific shows)
- Magazines (specific publications)
- Cultural Media (specific content)

Format as a JSON array with:
- 'type' (category name)
- 'title' (specific name)
- 'reason' (2-3 sentences explaining connection to their COMPLETE musical profile)
- 'link' (direct URL to specific item)`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const { musicData, count = 14 } = await req.json();
    
    console.log('Processing request with music data:', JSON.stringify(musicData, null, 2));

    if (!musicData || !musicData.genres || !musicData.artists || !musicData.tracks) {
      throw new Error('Invalid music data provided');
    }

    // Create a rich musical profile analysis
    const genreAnalysis = musicData.genres.length > 0 
      ? `Their diverse taste in ${musicData.genres.join(', ')} shows appreciation for multiple musical traditions.`
      : 'No genre data available.';
    
    const artistAnalysis = musicData.artists.length > 0
      ? `They follow artists like ${musicData.artists.join(', ')}, indicating varied musical interests.`
      : 'No artist data available.';

    const trackAnalysis = musicData.tracks.length > 0
      ? `Their top tracks include ${musicData.tracks.map(t => `${t.name} by ${t.artist}`).join(', ')}.`
      : 'No track data available.';

    const playlistAnalysis = musicData.playlists?.length > 0
      ? `Their playlists (${musicData.playlists.join(', ')}) suggest curated music experiences.`
      : 'No playlist data available.';

    const locationContext = musicData.country
      ? `Being based in ${musicData.country} might influence their cultural preferences.`
      : 'Location data not available.';

    console.log('Sending request to OpenAI with profile analysis');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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

              Provide ${count} unique cultural recommendations that deeply resonate with their complete musical identity.
              Ensure recommendations are evenly distributed across all categories.
              Each recommendation must be specific and include a direct URL to the item.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    let recommendations;
    try {
      recommendations = JSON.parse(data.choices[0].message.content);
      console.log('Parsed recommendations:', recommendations);
      
      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        throw new Error('Invalid recommendations format');
      }
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
        details: 'Check the function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});