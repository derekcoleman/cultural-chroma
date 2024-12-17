import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { genres, count = 4 } = await req.json()

    if (!genres || !Array.isArray(genres)) {
      return new Response(
        JSON.stringify({ error: 'Invalid genres parameter' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    const openai = new OpenAIApi(configuration)

    console.log('Generating recommendations for genres:', genres)

    const prompt = `Based on someone who likes music in these genres: ${genres.join(', ')}, generate ${count} recommendations in JSON format. Include a mix of books, travel destinations, and fashion items. Each recommendation should include:
    - type (one of: "book", "travel", "fashion")
    - title (the name of the book, place, or fashion item)
    - reason (explain why this recommendation matches their music taste)
    - link (a placeholder URL)
    Make the connections between the music genres and recommendations meaningful and specific.`

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const recommendations = JSON.parse(completion.data.choices[0].message.content)
    console.log('Generated recommendations:', recommendations)

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})