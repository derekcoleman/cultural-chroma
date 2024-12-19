import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Book, 
  Plane, 
  Shirt, 
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
  Film,
  Music2,
  LucideIcon
} from "lucide-react";
import { Recommendation } from "@/lib/recommendations";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "books": Book,
  "book": Book,
  "travel": Plane,
  "fashion": Shirt,
  "movies & tv": Tv,
  "home décor & art": Home,
  "food & drink": UtensilsCrossed,
  "online courses": GraduationCap,
  "hobbies & crafts": Palette,
  "wellness": Heart,
  "tech & gadgets": Laptop,
  "cultural events": CalendarDays,
  "podcasts": Headphones,
  "magazines": Newspaper,
  "cultural media": Film,
  "music": Music2
};

export const RecommendationCard = ({ recommendation, index }: RecommendationCardProps) => {
  const getIcon = (type: string) => {
    const normalizedType = type.toLowerCase().trim();
    const IconComponent = CATEGORY_ICONS[normalizedType];
    
    if (!IconComponent) {
      console.warn(`No icon found for category: ${type}`);
      return <Music2 className="h-5 w-5" />;
    }
    
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <Card 
      key={`${recommendation.title}-${index}`}
      className="group bg-spotify-darkgray border-none text-white overflow-hidden backdrop-blur-lg bg-opacity-50 hover:bg-opacity-70 transition-all duration-300"
    >
      <CardHeader className="border-b border-spotify-lightgray/10">
        <div className="flex items-center gap-3">
          <span className="text-spotify-green">
            {getIcon(recommendation.type)}
          </span>
          <CardTitle className="text-lg">{recommendation.type}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="font-medium mb-3 text-lg group-hover:text-spotify-green transition-colors">
          {recommendation.title}
        </h3>
        <p className="text-sm text-spotify-lightgray mb-6 line-clamp-3">
          {recommendation.reason}
        </p>
        <a 
          href={recommendation.link}
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
  );
};