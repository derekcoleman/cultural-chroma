import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

Analyze their complete musical profile including:
- All genres they listen to (not just the top one)
- The full range of artists they enjoy
- The diversity in their playlists
- Their location for regional relevance
- The overall themes and patterns in their music taste

For each category, recommend items that truly match their complete musical identity:

For books: Recommend specific titles on Goodreads/Amazon that thematically align with their music taste
For fashion: Link to specific clothing items on major retailers that match their music's aesthetic
For travel: Link to specific destinations/experiences that connect to their musical interests
For movies/TV: Link to specific shows/films on streaming platforms that share themes with their music
For home décor: Link to specific items that reflect their musical aesthetic
For food/drink: Link to specific establishments/products that match their cultural interests
For courses: Link to specific learning experiences that complement their musical interests
For hobbies: Link to specific activities that align with their musical preferences
For wellness: Link to specific programs that resonate with their music's energy
For tech: Link to specific products that enhance their music experience
For events: Link to specific upcoming events that match their taste
For podcasts: Link to specific shows that dive deep into their preferred genres
For magazines: Link to specific publications that cover their musical interests
For cultural media: Link to specific content that expands on their musical preferences

Format as a JSON array with:
- 'type' (category)
- 'title' (specific name)
- 'reason' (2-3 sentences explaining the deep connection to their complete musical profile)
- 'link' (direct URL to the specific item)

Ensure each recommendation:
1. Is a real, existing item/place/experience
2. Has a direct, working URL to the specific item
3. Connects to multiple aspects of their musical profile, not just one genre or artist
4. Provides value based on their complete musical identity`;

serve(async (req) => {
  console.log('Function invoked with method:', req.method);
  
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

    if (!musicData || !musicData.genres) {
      throw new Error('Invalid music data');
    }

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
              Make sure recommendations reflect the full breadth of their musical taste, not just one aspect.
              
              Important: Do not use search result URLs. Each URL must link directly to the specific item being recommended.`
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
        },
        {
          type: "Travel",
          title: "Third Man Records - Nashville Location",
          reason: "Jack White's famous record store/venue/recording studio offers a unique music pilgrimage experience that connects various genres and artistic approaches.",
          link: "https://thirdmanrecords.com/pages/nashville-storefront"
        },
        {
          type: "Fashion",
          title: "Dr. Martens 1460 Original Boot",
          reason: "These iconic boots transcend multiple music scenes and have been worn by artists across various genres, from punk to indie rock.",
          link: "https://www.drmartens.com/us/en/1460-smooth-leather-lace-up-boots/p/11822006"
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