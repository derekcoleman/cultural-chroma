import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recommendation } from "@/lib/recommendations";
import { Book, Plane, Shirt } from "lucide-react";

interface RecommendationGridProps {
  recommendations: Recommendation[];
}

const RecommendationGrid = ({ recommendations }: RecommendationGridProps) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((item) => (
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
  );
};

export default RecommendationGrid;