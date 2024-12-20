import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand, ArrowRight, Twitter, Instagram } from "lucide-react";
import { Artist } from "@/types/spotify";
import { generateNickname } from "@/utils/nicknameGenerator";
import { createShareText } from "@/utils/shareTextGenerator";
import { ProfileSummary } from "./ProfileSummary";

interface CultureProfileProps {
  artists: Artist[];
  tracks?: { name: string; artist: string; }[];
}

const CultureProfile = ({ artists, tracks = [] }: CultureProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get unique genres from all artists
  const allGenres = [...new Set(artists.flatMap(artist => artist.genres))];
  
  // Get unique artists including both top artists and track artists
  const allArtists = new Set([
    ...artists.map(a => a.name),
    ...tracks.map(t => t.artist)
  ]);

  // Generate aesthetic tags based on genres
  const generateAestheticTags = () => {
    const aestheticMapping: Record<string, string[]> = {
      jazz: ["sophisticated", "urban", "classic"],
      classical: ["refined", "traditional", "elegant"],
      rock: ["bold", "energetic", "rebellious"],
      electronic: ["modern", "innovative", "urban"],
      folk: ["authentic", "natural", "handcrafted"],
      pop: ["contemporary", "trendy", "social"],
      indie: ["alternative", "creative", "unique"],
      metal: ["intense", "dramatic", "bold"],
      hip: ["urban", "contemporary", "expressive"],
      rap: ["urban", "expressive", "bold"],
      soul: ["emotional", "authentic", "classic"],
      blues: ["authentic", "emotional", "classic"],
      country: ["traditional", "authentic", "natural"],
      reggae: ["relaxed", "natural", "social"],
      latin: ["passionate", "social", "energetic"]
    };

    const aestheticTags = new Set<string>();
    allGenres.forEach(genre => {
      const baseGenre = Object.keys(aestheticMapping).find(key => 
        genre.toLowerCase().includes(key)
      );
      if (baseGenre) {
        aestheticMapping[baseGenre].forEach(tag => aestheticTags.add(tag));
      }
    });

    return Array.from(aestheticTags);
  };

  const nickname = generateNickname(allGenres, generateAestheticTags());

  const handleShare = (platform: 'twitter' | 'instagram') => {
    const shareText = createShareText(
      nickname,
      allGenres,
      allArtists.size,
      allGenres.length
    );
    const url = platform === 'twitter' 
      ? `https://twitter.com/intent/tweet?text=${shareText}`
      : `https://www.instagram.com/create/story?text=${shareText}`;
    window.open(url, '_blank');
  };

  // Create a detailed cultural analysis
  const createDetailedAnalysis = () => {
    if (allGenres.length === 0) return "Add more music to get a detailed cultural analysis";

    const aestheticTags = generateAestheticTags();
    const tags = Array.from(aestheticTags).slice(0, 5);
    const artistCount = allArtists.size;
    const trackCount = tracks.length;
    const genreCount = allGenres.length;
    
    return `Your Musical Identity & Cultural Preferences

Congratulations! You've earned the title: "${nickname}" 🎉

Your musical journey encompasses ${artistCount} unique artists and ${trackCount} tracks, spanning ${genreCount} diverse genres. 
This rich tapestry of sound, particularly focused on ${allGenres.slice(0, 3).join(", ")}, reveals fascinating insights about your cultural preferences.

Your Aesthetic Profile: ${tags.join(" • ")}

Based on this comprehensive musical identity, here's how your tastes likely extend to other cultural domains:

Design Preferences
${tags.includes("modern") ? "• You're drawn to contemporary spaces with clean lines and innovative materials" : "• You appreciate timeless design with rich details and classic elements"}
${tags.includes("urban") ? "• Modern, industrial aesthetics resonate with your style" : "• Natural materials and organic forms speak to your sensibilities"}

Travel & Experiences
${tags.includes("urban") ? "• You thrive in vibrant city environments and cultural hotspots" : "• You're drawn to authentic local experiences and natural landscapes"}
${tags.includes("social") ? "• You seek out community events and shared experiences" : "• You value personal, intimate encounters with places and cultures"}

Fashion & Style
${tags.includes("bold") ? "• You're not afraid to make statements with your wardrobe choices" : "• You gravitate towards refined, timeless pieces"}
${tags.includes("creative") ? "• You mix unexpected elements to create unique looks" : "• You value quality materials and classic silhouettes"}

Cultural Consumption
${tags.includes("contemporary") ? "• You stay current with emerging artists and cultural movements" : "• You appreciate established masters and enduring works"}
${tags.includes("authentic") ? "• You seek out genuine, unfiltered cultural experiences" : "• You value curated, refined cultural expressions"}

Share your unique cultural identity with others and discover how your musical taste shapes your broader cultural preferences!`;
  };

  return (
    <div className="bg-spotify-darkgray/50 rounded-lg p-4 mb-8 hover:bg-spotify-darkgray/70 transition-colors">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full text-left flex items-center justify-between hover:bg-spotify-darkgray/80 group"
          >
            <div className="flex items-center gap-4">
              <Expand className="h-5 w-5 text-spotify-green" />
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  Your Cultural Profile
                  <span className="text-sm font-normal text-spotify-lightgray animate-pulse">
                    (Click to explore your unique identity!)
                  </span>
                </h3>
                <p className="text-sm text-spotify-lightgray">
                  <ProfileSummary 
                    nickname={nickname}
                    artistCount={allArtists.size}
                    trackCount={tracks.length}
                    topGenres={allGenres.slice(0, 3)}
                  />
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-spotify-lightgray opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-spotify-black text-white border-spotify-darkgray max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-spotify-green pb-4 flex items-center justify-between">
              <span>Your Cultural Profile Analysis</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-spotify-lightgray hover:text-white"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-spotify-lightgray hover:text-white"
                  onClick={() => handleShare('instagram')}
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6 text-spotify-lightgray">
            <p className="whitespace-pre-line leading-relaxed">{createDetailedAnalysis()}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CultureProfile;