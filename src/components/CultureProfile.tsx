import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { Artist } from "@/types/spotify";

interface Track {
  name: string;
  artist: string;
}

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

  // Create a brief summary based on musical profile
  const createBriefSummary = () => {
    if (allGenres.length === 0) return "Start adding music to see your cultural profile";
    
    const topGenres = allGenres.slice(0, 3);
    const artistCount = allArtists.size;
    
    return `Your music library includes ${artistCount} artists across genres like ${topGenres.join(", ")}`;
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
    const artistCount = allArtists.size;
    const trackCount = tracks.length;
    const genreCount = allGenres.length;
    
    return `Your musical profile spans ${artistCount} artists, ${trackCount} tracks, and ${genreCount} genres, 
    with particular emphasis on ${allGenres.slice(0, 3).join(", ")}. This diverse collection suggests 
    an appreciation for ${tags.join(", ")} aesthetics.
    
    Based on this comprehensive musical identity, your cultural preferences likely align with:
    
    • Design: ${tags.includes("modern") ? "Contemporary and minimalist designs with clean lines" : "Classic and timeless pieces with attention to detail"}
    • Travel: ${tags.includes("urban") ? "Urban exploration and cultural hotspots" : "Nature retreats and authentic local experiences"}
    • Fashion: ${tags.includes("bold") ? "Statement pieces and avant-garde designs" : "Refined, classic styles with quality materials"}
    • Literature: ${tags.includes("contemporary") ? "Modern narratives and cutting-edge perspectives" : "Thoughtful essays and timeless classics"}
    • Art: ${tags.includes("creative") ? "Experimental and boundary-pushing works" : "Traditional techniques and established masters"}
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