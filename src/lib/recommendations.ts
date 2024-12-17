type RecommendationType = 'Book' | 'Travel' | 'Fashion';

interface Recommendation {
  type: RecommendationType;
  title: string;
  reason: string;
  link: string;
  tags: string[];
}

const recommendationDatabase: Record<string, Recommendation[]> = {
  'indie rock': [
    {
      type: 'Book',
      title: 'On the Road by Jack Kerouac',
      reason: 'A classic that captures the indie spirit of adventure',
      link: 'https://amazon.com/On-Road-Jack-Kerouac/dp/0140283293',
      tags: ['adventure', 'bohemian', 'classic']
    },
    {
      type: 'Travel',
      title: 'Portland, Oregon',
      reason: 'A hub for indie music and culture',
      link: 'https://www.tripadvisor.com/Tourism-g52024-Portland_Oregon-Vacations.html',
      tags: ['urban', 'artistic', 'coffee']
    },
    {
      type: 'Fashion',
      title: 'Vintage Denim Jacket',
      reason: 'A timeless piece that matches indie aesthetics',
      link: 'https://www.urbanoutfitters.com/shop/vintage-denim-jacket',
      tags: ['vintage', 'casual', 'versatile']
    }
  ],
  'electronic': [
    {
      type: 'Book',
      title: 'Neuromancer by William Gibson',
      reason: 'A cyberpunk classic that matches electronic music vibes',
      link: 'https://amazon.com/Neuromancer-William-Gibson/dp/0441569595',
      tags: ['sci-fi', 'futuristic', 'tech']
    },
    {
      type: 'Travel',
      title: 'Berlin, Germany',
      reason: 'World-renowned electronic music scene',
      link: 'https://www.tripadvisor.com/Tourism-g187323-Berlin-Vacations.html',
      tags: ['nightlife', 'urban', 'modern']
    },
    {
      type: 'Fashion',
      title: 'Tech Wear Collection',
      reason: 'Futuristic fashion that matches electronic aesthetics',
      link: 'https://www.nike.com/tech-pack',
      tags: ['modern', 'urban', 'sleek']
    }
  ],
  'folk': [
    {
      type: 'Book',
      title: 'Walden by Henry David Thoreau',
      reason: 'Nature-focused literature that resonates with folk music themes',
      link: 'https://amazon.com/Walden-Henry-David-Thoreau/dp/1505297729',
      tags: ['nature', 'philosophical', 'classic']
    },
    {
      type: 'Travel',
      title: 'Asheville, North Carolina',
      reason: 'A mountain town with a thriving folk music scene',
      link: 'https://www.tripadvisor.com/Tourism-g60742-Asheville_North_Carolina-Vacations.html',
      tags: ['nature', 'artistic', 'mountains']
    },
    {
      type: 'Fashion',
      title: 'Artisanal Wool Sweater',
      reason: 'Handcrafted clothing that reflects folk aesthetics',
      link: 'https://www.etsy.com/market/wool_sweater',
      tags: ['handmade', 'natural', 'cozy']
    }
  ]
};

export const getRecommendations = (genres: string[]): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  genres.forEach(genre => {
    const genreKey = Object.keys(recommendationDatabase).find(key => 
      genre.toLowerCase().includes(key.toLowerCase())
    );
    
    if (genreKey) {
      recommendations.push(...recommendationDatabase[genreKey]);
    }
  });
  
  // If no specific recommendations found, return indie rock as default
  if (recommendations.length === 0) {
    return recommendationDatabase['indie rock'];
  }
  
  return recommendations.slice(0, 6); // Limit to 6 recommendations
};