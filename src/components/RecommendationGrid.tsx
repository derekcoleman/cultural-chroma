import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Book, 
  Plane, 
  Shirt, 
  ChevronDown, 
  Plus, 
  Loader2,
  Tv,
  Home,
  UtensilsCrossed,
  GraduationCap,
  Palette,
  Heart,
  Laptop,
  CalendarDays,
  Headphones,
  Newspaper,
  Film
} from "lucide-react";
import { Recommendation, getRecommendations, MusicData } from "@/lib/recommendations";
import { useToast } from "@/components/ui/use-toast";

interface RecommendationGridProps {
  recommendations: Recommendation[];
  musicData: MusicData | null;
  onLoadMore: (newRecommendations: Recommendation[]) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Categories", icon: null },
  { id: "book", label: "Books", icon: Book },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "movies & tv", label: "Movies & TV", icon: Tv },
  { id: "home décor & art", label: "Home Décor & Art", icon: Home },
  { id: "food & drink", label: "Food & Drink", icon: UtensilsCrossed },
  { id: "online courses", label: "Online Courses", icon: GraduationCap },
  { id: "hobbies & crafts", label: "Hobbies & Crafts", icon: Palette },
  { id: "wellness", label: "Wellness", icon: Heart },
  { id: "tech & gadgets", label: "Tech & Gadgets", icon: Laptop },
  { id: "cultural events", label: "Cultural Events", icon: CalendarDays },
  { id: "podcasts", label: "Podcasts", icon: Headphones },
  { id: "magazines", label: "Magazines", icon: Newspaper },
  { id: "cultural media", label: "Cultural Media", icon: Film },
];

const RecommendationGrid = ({ recommendations, musicData, onLoadMore }: RecommendationGridProps) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [loadedRecommendations, setLoadedRecommendations] = useState<Recommendation[]>(recommendations);
  const { toast } = useToast();

  // Update loadedRecommendations when recommendations prop changes
  useEffect(() => {
    setLoadedRecommendations(recommendations);
  }, [recommendations]);

  const getIcon = (type: string) => {
    const category = CATEGORIES.find(cat => cat.id.toLowerCase() === type.toLowerCase());
    if (category && category.icon) {
      const Icon = category.icon;
      return <Icon className="h-5 w-5" />;
    }
    return null;
  };

  const filteredRecommendations = loadedRecommendations.filter(item => 
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
      // Request new recommendations
      const newRecommendations = await getRecommendations(musicData, 14);
      
      // Add only unique recommendations
      const existingTitles = new Set(loadedRecommendations.map(r => r.title));
      const uniqueNewRecommendations = newRecommendations.filter(
        rec => !existingTitles.has(rec.title)
      );

      if (uniqueNewRecommendations.length === 0) {
        toast({
          variant: "destructive",
          title: "No New Recommendations",
          description: "Unable to generate new unique recommendations. Please try again later.",
        });
        return;
      }

      setLoadedRecommendations(prev => [...prev, ...uniqueNewRecommendations]);
      onLoadMore(uniqueNewRecommendations);
      
      toast({
        title: "New Recommendations",
        description: `Successfully loaded ${uniqueNewRecommendations.length} new recommendations`,
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
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-spotify-darkgray border-spotify-lightgray/20 text-white">
              {CATEGORIES.find(cat => cat.id === selectedType)?.label || "All Categories"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-spotify-darkgray border-spotify-lightgray/20 max-h-[300px] overflow-y-auto">
            {CATEGORIES.map((category) => (
              <DropdownMenuItem 
                key={category.id}
                onClick={() => setSelectedType(category.id)} 
                className="text-white hover:bg-white/10 flex items-center gap-2"
              >
                {category.icon && <category.icon className="h-4 w-4" />}
                {category.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((item, index) => (
          <Card 
            key={`${item.title}-${index}`}
            className="group bg-spotify-darkgray border-none text-white overflow-hidden backdrop-blur-lg bg-opacity-50 hover:bg-opacity-70 transition-all duration-300"
          >
            <CardHeader className="border-b border-spotify-lightgray/10">
              <div className="flex items-center gap-3">
                <span className="text-spotify-green">
                  {getIcon(item.type)}
                </span>
                <CardTitle className="text-lg">{item.type}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="font-medium mb-3 text-lg group-hover:text-spotify-green transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-spotify-lightgray mb-6 line-clamp-3">
                {item.reason}
              </p>
              <a 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-spotify-green hover:text-white transition-colors text-sm font-medium"
              >
                Explore More
                <svg
                  className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </CardContent>
          </Card>
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
