import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recommendation } from "@/lib/recommendations";

interface RecommendationGridProps {
  recommendations: Recommendation[];
}

const RecommendationGrid = ({ recommendations }: RecommendationGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {recommendations.map((item) => (
        <Card 
          key={item.title} 
          className="bg-spotify-darkgray border-none text-white hover:ring-2 hover:ring-spotify-green transition-all"
        >
          <CardHeader>
            <CardTitle className="text-lg">{item.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium mb-2">{item.title}</h3>
            <p className="text-sm text-spotify-lightgray mb-4">{item.reason}</p>
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-spotify-green hover:underline text-sm mt-4 block"
            >
              Learn More →
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecommendationGrid;