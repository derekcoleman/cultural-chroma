import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a sophisticated cultural recommendation expert with deep knowledge of music and its connections to broader culture. Your task is to analyze a user's complete musical profile in detail and provide highly personalized recommendations across various cultural domains.

Analyze their musical identity through multiple lenses:
1. Genre Analysis: Examine the full spectrum of genres they enjoy, including subgenres and fusion styles
2. Artist Analysis: Study their preferred artists' artistic approaches, themes, and cultural impact
3. Listening Patterns: Consider how their playlist names and track selections reveal their music consumption habits
4. Cultural Context: Factor in their geographic location and how it might influence their cultural preferences
5. Temporal Patterns: Look for any preferences in terms of music eras or contemporary vs. classic content

For each recommendation:
- Draw clear connections between multiple aspects of their musical profile
- Explain how the recommendation aligns with specific elements of their taste
- Ensure recommendations are culturally relevant to their location when applicable
- Provide specific, actionable links to explore or purchase the recommended items

Format your response as a JSON array of objects, each with:
- 'type' (specific category)
- 'title' (specific name/place/item)
- 'reason' (2-3 sentences explaining the deep connection to their musical profile)
- 'link' (direct URL to explore/purchase)`;

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
    console.log('Analyzing music data:', JSON.stringify(musicData));

    // Create a rich musical profile analysis
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

              Provide ${count} cultural recommendations that would deeply resonate with this complete musical identity.
              Ensure recommendations are evenly distributed across all categories.
              Each recommendation must be a specific item with a direct URL to purchase/access it.
              Make sure recommendations reflect the full breadth of their musical taste, not just one aspect.`
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
      recommendations = [
        {
          type: "Book",
          title: "Please Kill Me: The Uncensored Oral History of Punk by Legs McNeil",
          reason: "This comprehensive oral history connects deeply with various musical genres and artistic movements, perfect for understanding the evolution of alternative music culture.",
          link: "https://www.goodreads.com/book/show/14595.Please_Kill_Me"
        }
      ];
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