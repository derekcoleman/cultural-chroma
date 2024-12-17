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
      reason: 'This beat generation classic captures the same spirit of freedom and self-discovery that defines indie rock',
      link: 'https://amazon.com/On-Road-Jack-Kerouac/dp/0140283293',
      tags: ['adventure', 'bohemian', 'classic']
    },
    {
      type: 'Book',
      title: 'Just Kids by Patti Smith',
      reason: 'A memoir about artistic growth and independence in New York City that resonates with indie rock\'s DIY ethos',
      link: 'https://amazon.com/Just-Kids-Patti-Smith/dp/0060936223',
      tags: ['memoir', 'music', 'art']
    },
    {
      type: 'Travel',
      title: 'Portland, Oregon',
      reason: 'A city that breathes indie culture, from its thriving music scene to its quirky neighborhoods',
      link: 'https://www.tripadvisor.com/Tourism-g52024-Portland_Oregon-Vacations.html',
      tags: ['urban', 'artistic', 'coffee']
    },
    {
      type: 'Travel',
      title: 'Montreal, Canada',
      reason: 'Home to iconic indie bands and festivals like Osheaga, with a vibrant arts scene',
      link: 'https://www.tripadvisor.com/Tourism-g155032-Montreal_Quebec-Vacations.html',
      tags: ['music', 'festivals', 'culture']
    },
    {
      type: 'Fashion',
      title: 'Vintage Denim Jacket',
      reason: 'A staple of indie fashion that embodies both style and authenticity',
      link: 'https://www.urbanoutfitters.com/shop/vintage-denim-jacket',
      tags: ['vintage', 'casual', 'versatile']
    },
    {
      type: 'Fashion',
      title: 'Doc Martens Boots',
      reason: 'These iconic boots perfectly blend indie rock attitude with timeless style',
      link: 'https://www.drmartens.com',
      tags: ['boots', 'classic', 'edgy']
    }
  ],
  'electronic': [
    {
      type: 'Book',
      title: 'Neuromancer by William Gibson',
      reason: 'This cyberpunk masterpiece pioneered the techno-futuristic aesthetic that electronic music often explores',
      link: 'https://amazon.com/Neuromancer-William-Gibson/dp/0441569595',
      tags: ['sci-fi', 'futuristic', 'tech']
    },
    {
      type: 'Book',
      title: 'Energy Flash by Simon Reynolds',
      reason: 'The definitive history of electronic dance music and rave culture',
      link: 'https://amazon.com/Energy-Flash-Journey-Through-Culture/dp/1593764774',
      tags: ['music', 'history', 'culture']
    },
    {
      type: 'Travel',
      title: 'Berlin, Germany',
      reason: 'The global capital of electronic music, with legendary clubs and a thriving techno scene',
      link: 'https://www.tripadvisor.com/Tourism-g187323-Berlin-Vacations.html',
      tags: ['nightlife', 'urban', 'modern']
    },
    {
      type: 'Travel',
      title: 'Tokyo, Japan',
      reason: 'A futuristic metropolis where electronic music meets cutting-edge technology',
      link: 'https://www.tripadvisor.com/Tourism-g298184-Tokyo_Tokyo_Prefecture_Kanto-Vacations.html',
      tags: ['technology', 'urban', 'futuristic']
    },
    {
      type: 'Fashion',
      title: 'Tech Wear Collection',
      reason: 'Functional, futuristic clothing that matches the forward-thinking spirit of electronic music',
      link: 'https://www.nike.com/tech-pack',
      tags: ['modern', 'urban', 'sleek']
    },
    {
      type: 'Fashion',
      title: 'LED Light-Up Accessories',
      reason: 'Wearable tech that brings the visual energy of electronic music to your style',
      link: 'https://www.etsy.com/market/led_accessories',
      tags: ['futuristic', 'festival', 'unique']
    }
  ],
  'folk': [
    {
      type: 'Book',
      title: 'Walden by Henry David Thoreau',
      reason: 'This meditation on simple living and nature perfectly aligns with folk music\'s earthly wisdom',
      link: 'https://amazon.com/Walden-Henry-David-Thoreau/dp/1505297729',
      tags: ['nature', 'philosophical', 'classic']
    },
    {
      type: 'Book',
      title: 'Chronicles: Volume One by Bob Dylan',
      reason: 'A personal journey through folk music\'s golden age by one of its greatest storytellers',
      link: 'https://amazon.com/Chronicles-Bob-Dylan/dp/0743244583',
      tags: ['memoir', 'music', 'history']
    },
    {
      type: 'Travel',
      title: 'Asheville, North Carolina',
      reason: 'A mountain town where traditional folk music thrives alongside craft culture',
      link: 'https://www.tripadvisor.com/Tourism-g60742-Asheville_North_Carolina-Vacations.html',
      tags: ['nature', 'artistic', 'mountains']
    },
    {
      type: 'Travel',
      title: 'County Clare, Ireland',
      reason: 'The heartland of Irish folk music, where traditional sessions happen nightly in cozy pubs',
      link: 'https://www.tripadvisor.com/Tourism-g186595-County_Clare-Vacations.html',
      tags: ['traditional', 'music', 'culture']
    },
    {
      type: 'Fashion',
      title: 'Artisanal Wool Sweater',
      reason: 'Handcrafted warmth that embodies folk music\'s appreciation for traditional craftsmanship',
      link: 'https://www.etsy.com/market/wool_sweater',
      tags: ['handmade', 'natural', 'cozy']
    },
    {
      type: 'Fashion',
      title: 'Vintage Turquoise Jewelry',
      reason: 'These timeless pieces connect to folk music\'s roots in American traditional culture',
      link: 'https://www.etsy.com/market/vintage_turquoise_jewelry',
      tags: ['traditional', 'handmade', 'authentic']
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