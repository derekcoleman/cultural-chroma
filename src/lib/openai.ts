const SYSTEM_PROMPT = `You are a cultural recommendation expert. Based on the user's music taste, 
you should suggest relevant books, travel destinations, and fashion items that align with their preferences. 
Format your response as a JSON array of objects, each with 'type' (Book/Travel/Fashion), 'title', 'reason', and 'link' properties.`;

export const getAIRecommendations = async (genres: string[]) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { 
            role: 'user', 
            content: `Based on these music genres: ${genres.join(', ')}, 
              provide 6 cultural recommendations (2 books, 2 travel destinations, 2 fashion items) 
              that would appeal to someone with this music taste. Include specific reasons for each recommendation.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};