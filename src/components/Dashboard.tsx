import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { spotifyApi, getTopArtists } from "@/lib/spotify";
import { getRecommendations } from "@/lib/recommendations";
import { Loader2 } from "lucide-react";

interface Artist {
  name: string;
  genres: string[];
}

interface Recommendation {
  type: string;
  title: string;
  reason: string;
  link: string;
}

const Dashboard = () => {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeSpotify = async () => {
      try {
        const accessToken = await spotifyApi.authenticate();
        
        if (accessToken) {
          const artists = await getTopArtists();
          setTopArtists(artists);
          
          // Get all genres from top artists
          const allGenres = artists.flatMap(artist => artist.genres);
          const aiRecommendations = await getRecommendations(allGenres);
          setRecommendations(aiRecommendations);
          
          toast({
            title: "Connected to Spotify",
            description: "Successfully retrieved your music preferences",
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try logging in again",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSpotify();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Cultural Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-spotify-darkgray border-none text-white">
            <CardHeader>
              <CardTitle>Top Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {topArtists.map((artist) => (
                  <li key={artist.name} className="flex justify-between items-center">
                    <span className="font-medium">{artist.name}</span>
                    <span className="text-spotify-lightgray">
                      {artist.genres.slice(0, 2).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold mb-6">AI-Powered Recommendations</h2>
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
      </div>
    </div>
  );
};

export default Dashboard;