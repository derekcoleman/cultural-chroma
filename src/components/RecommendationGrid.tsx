import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, Plane, Shirt, ChevronDown, Plus } from "lucide-react";
import { Recommendation } from "@/lib/recommendations";

interface RecommendationGridProps {
  recommendations: Recommendation[];
}

const RecommendationGrid = ({ recommendations }: RecommendationGridProps) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(6);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'book':
        return <Book className="h-5 w-5" />;
      case 'travel':
        return <Plane className="h-5 w-5" />;
      case 'fashion':
        return <Shirt className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const filteredRecommendations = recommendations.filter(item => 
    selectedType === "all" ? true : item.type.toLowerCase() === selectedType.toLowerCase()
  );

  const displayedRecommendations = filteredRecommendations.slice(0, displayCount);
  const hasMore = displayedRecommendations.length < filteredRecommendations.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-spotify-darkgray border-spotify-lightgray/20 text-white">
              {selectedType === "all" ? "All Categories" : selectedType}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-spotify-darkgray border-spotify-lightgray/20">
            <DropdownMenuItem onClick={() => setSelectedType("all")} className="text-white hover:bg-white/10">
              All Categories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedType("book")} className="text-white hover:bg-white/10">
              Books
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedType("travel")} className="text-white hover:bg-white/10">
              Travel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedType("fashion")} className="text-white hover:bg-white/10">
              Fashion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRecommendations.map((item) => (
          <Card 
            key={item.title} 
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

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => setDisplayCount(prev => prev + 6)}
            variant="outline"
            className="bg-spotify-darkgray border-spotify-lightgray/20 text-white hover:bg-white/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            View More
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationGrid;