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
    console.log('Received request with genres:', genres, 'count:', count)

    if (!genres || !Array.isArray(genres)) {
      console.error('Invalid genres parameter received')
      return new Response(
        JSON.stringify({ error: 'Invalid genres parameter' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      console.error('OpenAI API key not found')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const configuration = new Configuration({
      apiKey: apiKey,
    })

    const openai = new OpenAIApi(configuration)

    console.log('Generating recommendations for genres:', genres)

    const prompt = `Based on someone who likes music in these genres: ${genres.join(', ')}, generate ${count} recommendations in JSON format. Include a mix of books, travel destinations, and fashion items. Each recommendation should include:
    - type (one of: "book", "travel", "fashion")
    - title (the name of the book, place, or fashion item)
    - reason (explain why this recommendation matches their music taste)
    - link (a placeholder URL)
    Make the connections between the music genres and recommendations meaningful and specific. Return ONLY the JSON array with no additional text.`

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that generates recommendations in JSON format. Always return a valid JSON array of recommendations."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
    })

    const content = completion.data.choices[0].message.content.trim()
    console.log('Raw OpenAI response:', content)

    let recommendations
    try {
      // Try to parse the response, looking for array brackets if needed
      const startIdx = content.indexOf('[')
      const endIdx = content.lastIndexOf(']')
      if (startIdx !== -1 && endIdx !== -1) {
        recommendations = JSON.parse(content.slice(startIdx, endIdx + 1))
      } else {
        recommendations = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate valid recommendations' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully generated recommendations:', recommendations)

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in get-recommendations function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})