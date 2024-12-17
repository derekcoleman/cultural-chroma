import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { spotifyApi, getTopArtists } from "@/lib/spotify";
import { getRecommendations } from "@/lib/recommendations";
import { supabase } from "@/integrations/supabase/client";
import TopArtists from "./TopArtists";
import RecommendationGrid from "./RecommendationGrid";
import type { Artist } from "@/types/spotify";
import type { Recommendation } from "@/lib/recommendations";

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
          
          // Save favorite artists to Supabase
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            for (const artist of artists) {
              await supabase
                .from('favorite_artists')
                .upsert({
                  user_id: user.id,
                  artist_name: artist.name,
                  genres: artist.genres,
                }, {
                  onConflict: 'user_id,artist_name'
                });
            }
          }
          
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
          <TopArtists artists={topArtists} />
        </div>

        <h2 className="text-3xl font-bold mb-6">AI-Powered Recommendations</h2>
        <RecommendationGrid recommendations={recommendations} />
      </div>
    </div>
  );
};

export default Dashboard;