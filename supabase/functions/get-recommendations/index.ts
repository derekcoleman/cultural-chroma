import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a cultural recommendation expert. Based on the user's music genres, suggest relevant books, travel destinations, and fashion items that align with their preferences. For each recommendation, provide:
- A specific title/place/item name
- A 2-3 sentence explanation connecting it to their music taste
- A relevant URL for more information
Format as a JSON array with 'type' (Book/Travel/Fashion), 'title', 'reason', and 'link' fields.`;

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

    const { genres, count = 4 } = await req.json();
    console.log('Received request with genres:', genres);

    if (!genres || !Array.isArray(genres)) {
      throw new Error('Invalid genres parameter');
    }

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
            content: `Based on these music genres: ${genres.join(', ')}, provide ${count} cultural recommendations that would appeal to someone with this music taste. Include specific reasons for each recommendation.`
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
    console.log('OpenAI response:', JSON.stringify(data));

    let recommendations;
    try {
      recommendations = JSON.parse(data.choices[0].message.content);
      console.log('Parsed recommendations:', JSON.stringify(recommendations));
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      recommendations = genres.map((genre: string) => ({
        type: "Book",
        title: `${genre} Music Guide`,
        reason: `A comprehensive guide to ${genre} music and its cultural impact.`,
        link: `https://www.goodreads.com/search?q=${encodeURIComponent(genre)}+music`
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