import { spotifyApi } from './spotify';

const SYSTEM_PROMPT = `You are a cultural recommendation expert. Based on the user's music taste, 
you should suggest relevant books, travel destinations, and fashion items that align with their preferences. 
Format your response as a JSON array of objects, each with 'type' (Book/Travel/Fashion), 'title', 'reason', and 'link' properties.`;

export const getAIRecommendations = async (genres: string[]) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not found');
    throw new Error('OpenAI API key not configured');
  }

  const userPrompt = `Based on these music genres: ${genres.join(', ')}, 
    provide 6 cultural recommendations (2 books, 2 travel destinations, 2 fashion items) 
    that would appeal to someone with this music taste. Include specific reasons for each recommendation.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};