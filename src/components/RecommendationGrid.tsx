import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { getRecommendations } from "@/lib/recommendations";
import type { Recommendation, MusicData } from "@/types/recommendations";
import { useToast } from "@/components/ui/use-toast";
import { RecommendationCard } from "./RecommendationCard";
import { CategoryFilter } from "./CategoryFilter";

interface RecommendationGridProps {
  recommendations: Recommendation[];
  musicData: MusicData | null;
  onLoadMore: (newRecommendations: Recommendation[]) => void;
}

const RecommendationGrid = ({ recommendations, musicData, onLoadMore }: RecommendationGridProps) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [previousRecommendations, setPreviousRecommendations] = useState<Recommendation[]>([]);

  const filteredRecommendations = recommendations.filter(item => 
    selectedType === "all" ? true : item.type.toLowerCase() === selectedType.toLowerCase()
  );

  const handleLoadMore = async () => {
    if (!musicData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Music data not available. Please try refreshing the page.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const allPreviousRecommendations = [...previousRecommendations, ...recommendations];
      setPreviousRecommendations(allPreviousRecommendations);
      
      const newRecommendations = await getRecommendations(
        musicData, 
        15, 
        allPreviousRecommendations,
        selectedType !== "all" ? selectedType : undefined
      );
      
      if (newRecommendations.length === 0) {
        toast({
          variant: "destructive",
          title: "No More Recommendations",
          description: "We've exhausted our unique recommendations based on your taste. Try exploring different categories!",
        });
        return;
      }
      
      onLoadMore(newRecommendations);
      toast({
        title: "New Recommendations",
        description: "Successfully loaded more unique recommendations based on your music taste",
      });
    } catch (error) {
      console.error('Error loading more recommendations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load more recommendations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CategoryFilter selectedType={selectedType} onSelectType={setSelectedType} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((item, index) => (
          <RecommendationCard 
            key={`${item.title}-${index}`}
            recommendation={item}
            index={index}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleLoadMore}
          variant="outline"
          className="bg-spotify-darkgray border-spotify-lightgray/20 text-white hover:bg-white/10"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Load More Recommendations
        </Button>
      </div>
    </div>
  );
};

export default RecommendationGrid;