import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { Artist } from "@/types/spotify";

interface CultureProfileProps {
  artists: Artist[];
}

const CultureProfile = ({ artists }: CultureProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get unique genres from all artists
  const allGenres = [...new Set(artists.flatMap(artist => artist.genres))];
  
  // Create a brief summary based on top genres
  const createBriefSummary = () => {
    if (allGenres.length === 0) return "Start adding music to see your cultural profile";
    
    const topGenres = allGenres.slice(0, 3);
    return `Your music taste suggests an affinity for ${topGenres.join(", ")}`;
  };

  // Create a detailed cultural analysis
  const createDetailedAnalysis = () => {
    if (allGenres.length === 0) return "Add more music to get a detailed cultural analysis";

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

    // Collect aesthetic tags based on genres
    const aestheticTags = new Set<string>();
    allGenres.forEach(genre => {
      const baseGenre = Object.keys(aestheticMapping).find(key => 
        genre.toLowerCase().includes(key)
      );
      if (baseGenre) {
        aestheticMapping[baseGenre].forEach(tag => aestheticTags.add(tag));
      }
    });

    const tags = Array.from(aestheticTags).slice(0, 5);
    
    return `Based on your music preferences, particularly your interest in ${allGenres.slice(0, 3).join(", ")}, 
    your cultural profile suggests an appreciation for ${tags.join(", ")} aesthetics. 
    This unique combination often correlates with a taste for:
    
    • Design: ${tags.includes("modern") ? "Contemporary and minimalist" : "Classic and timeless"} pieces
    • Travel: ${tags.includes("urban") ? "Vibrant city exploration" : "Nature and cultural immersion"}
    • Fashion: ${tags.includes("bold") ? "Statement pieces and unique designs" : "Refined and classic styles"}
    • Literature: ${tags.includes("contemporary") ? "Modern narratives and fresh perspectives" : "Classic literature and thoughtful essays"}
    `;
  };

  return (
    <div className="bg-spotify-darkgray/50 rounded-lg p-4 mb-8">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full text-left flex items-center gap-2 hover:bg-spotify-darkgray/80"
          >
            <Expand className="h-5 w-5 text-spotify-green" />
            <div>
              <h3 className="text-lg font-semibold text-white">Your Cultural Profile</h3>
              <p className="text-sm text-spotify-lightgray">{createBriefSummary()}</p>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-spotify-black text-white border-spotify-darkgray">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-spotify-green">
              Cultural Profile Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-spotify-lightgray">
            <p className="whitespace-pre-line">{createDetailedAnalysis()}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CultureProfile;