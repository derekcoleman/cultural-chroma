interface CulturalTrait {
  category: string;
  trait: string;
  weight: number;
}

export const generateNickname = (
  genres: string[],
  aestheticTags: string[],
  recommendations: { type: string; title: string }[] = []
) => {
  const traits: CulturalTrait[] = [];

  // Add musical traits
  const musicPrefixes = {
    jazz: "Jazz Cat",
    classical: "Maestro",
    rock: "Rock Star",
    electronic: "Digital Nomad",
    folk: "Folk Soul",
    pop: "Pop Icon",
    indie: "Indie Spirit",
    metal: "Metal Warrior",
    hip: "Hip Hop Head",
    rap: "Flow Master",
    soul: "Soul Seeker",
    blues: "Blues Wanderer",
    country: "Country Heart",
    reggae: "Reggae Rider",
    latin: "Latin Groove"
  };

  // Add genre-based traits
  Object.entries(musicPrefixes).forEach(([key, value]) => {
    if (genres.some(genre => genre.toLowerCase().includes(key))) {
      traits.push({ category: 'music', trait: value, weight: 3 });
    }
  });

  // Add aesthetic-based traits
  const aestheticPrefixes: Record<string, string> = {
    modern: "Contemporary",
    urban: "Metropolitan",
    authentic: "Authentic",
    creative: "Creative",
    bold: "Bold",
    refined: "Refined",
    traditional: "Traditional",
    innovative: "Innovative"
  };

  aestheticTags.forEach(tag => {
    if (aestheticPrefixes[tag]) {
      traits.push({ category: 'aesthetic', trait: aestheticPrefixes[tag], weight: 2 });
    }
  });

  // Add recommendation-based traits
  const recommendationPrefixes: Record<string, string> = {
    Book: "Literary",
    Travel: "Wandering",
    Fashion: "Stylish"
  };

  recommendations.forEach(rec => {
    if (recommendationPrefixes[rec.type]) {
      traits.push({ category: 'interests', trait: recommendationPrefixes[rec.type], weight: 1 });
    }
  });

  // Select primary and secondary traits based on weights
  const sortedTraits = traits.sort((a, b) => b.weight - a.weight);
  const primaryTrait = sortedTraits[0]?.trait || "Cultural";
  const secondaryTrait = sortedTraits[1]?.trait || "Explorer";

  // Add fun suffixes
  const suffixes = [
    "Extraordinaire",
    "Supreme",
    "of the Digital Age",
    "of the Underground",
    "of the Future",
    "in Training",
    "2.0",
    "Ultimate",
    "Mastermind",
    "Guru"
  ];

  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  // Combine traits
  return `${primaryTrait} ${secondaryTrait} ${suffix}`;
};