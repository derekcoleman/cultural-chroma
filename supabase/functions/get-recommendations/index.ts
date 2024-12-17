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

const SYSTEM_PROMPT = `You are a cultural recommendation expert. Based on the user's detailed music preferences, suggest highly specific recommendations across various categories. Each recommendation must be a real, specific item/place/experience with a dedicated URL where it can be found (not search results).

For books: Recommend specific titles available on Goodreads or Amazon
For fashion: Link to specific items on major retailers
For travel: Link to specific destination guides or booking pages
For movies/TV: Link to specific shows/movies on streaming platforms
For home décor: Link to specific items on design websites
For food/drink: Link to specific restaurants or products
For courses: Link to specific courses on platforms like Coursera/Udemy
For hobbies: Link to specific starter kits or learning resources
For wellness: Link to specific programs or products
For tech: Link to specific products on major retailers
For events: Link to specific upcoming events or venues
For podcasts: Link to specific shows on Spotify/Apple Podcasts
For magazines: Link to specific subscription pages
For cultural media: Link to specific articles/content

Format as a JSON array with:
- 'type' (category)
- 'title' (specific name)
- 'reason' (2-3 sentences explaining connection to their music taste)
- 'link' (direct URL to the specific item)

Ensure each recommendation is:
1. A real, existing item/place/experience
2. Has a direct, working URL
3. Is specifically chosen based on the user's music preferences
4. Links to the actual item, not a search page`;

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

              Provide ${count} cultural recommendations (one for each category) that would deeply resonate with their taste.
              Each recommendation must be a specific item with a direct URL to purchase/access it.
              Make sure recommendations are personally tailored to their musical preferences.`
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
          title: "Just Kids by Patti Smith",
          reason: "A memoir about art, music, and creativity in New York City. Perfect for music lovers who appreciate artistic journeys and cultural history.",
          link: "https://www.goodreads.com/book/show/341879.Just_Kids"
        },
        {
          type: "Travel",
          title: "Nashville Music Row Tour",
          reason: "Experience the heart of country music history with guided tours of legendary recording studios and songwriter hangouts.",
          link: "https://www.viator.com/Nashville-attractions/Music-Row/d799-a1866"
        },
        {
          type: "Fashion",
          title: "Vintage Band T-Shirt Collection at Beyond Retro",
          reason: "Authentic vintage band merchandise that connects you directly to music history.",
          link: "https://www.beyondretro.com/collections/band-t-shirts"
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