import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Music2, 
  HeadphonesIcon,
  Rocket,
  Music,
  Music3,
  Music4,
  CloudDownload,
  Shuffle,
  Headphones,
  Speaker,
  Volume,
  Volume2,
  Radio
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  spotifyApi, 
  getTopArtists, 
  getTopTracks, 
  getUserPlaylists,
  getUserProfile,
} from "@/lib/spotify";
import { getRecommendations } from "@/lib/recommendations";
import { supabase } from "@/integrations/supabase/client";
import TopArtists from "./TopArtists";
import RecommendationGrid from "./RecommendationGrid";
import type { Artist } from "@/types/spotify";
import type { Recommendation, MusicData } from "@/lib/recommendations";

const LoadingIcon = ({ className }: { className?: string }) => {
  const [iconIndex, setIconIndex] = useState(0);
  const icons = [
    <Rocket className={className} />,
    <Music className={className} />,
    <Music3 className={className} />,
    <Music4 className={className} />,
    <CloudDownload className={className} />,
    <Shuffle className={className} />,
    <Headphones className={className} />,
    <Speaker className={className} />,
    <Volume className={className} />,
    <Volume2 className={className} />,
    <Radio className={className} />,
    <Loader2 className={className} />
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 400); // Reduced from 800ms to 400ms for faster rotation

    return () => clearInterval(interval);
  }, []);

  return icons[iconIndex];
};

const Dashboard = () => {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [musicData, setMusicData] = useState<MusicData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeSpotify = async () => {
      try {
        const accessToken = await spotifyApi.authenticate();
        
        if (accessToken) {
          // Fetch all Spotify data in parallel
          const [
            artistsResponse,
            tracks,
            playlists,
            profile,
          ] = await Promise.all([
            getTopArtists(),
            getTopTracks(),
            getUserPlaylists(),
            getUserProfile(),
          ]);

          // Transform artist data to ensure it matches the Artist type
          const artists: Artist[] = artistsResponse.map(artist => ({
            name: artist.name,
            genres: artist.genres || [],
            id: artist.id
          }));

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
                  genres: artist.genres || [],
                }, {
                  onConflict: 'user_id,artist_name'
                });
            }
          }
          
          // Collect all musical preferences
          const allGenres = artists.flatMap(artist => artist.genres);
          
          // Collect playlist names
          const playlistNames = playlists.map(playlist => playlist.name);
          
          // Combine all musical data
          const newMusicData: MusicData = {
            genres: [...new Set(allGenres)],
            artists: artists.map(a => a.name),
            tracks: tracks.map(t => ({
              name: t.name,
              artist: t.artists[0].name
            })),
            playlists: playlistNames,
            country: profile.country,
          };

          setMusicData(newMusicData);
          const aiRecommendations = await getRecommendations(newMusicData);
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

  const handleLoadMore = async (newRecommendations: Recommendation[]) => {
    setRecommendations(prev => [...prev, ...newRecommendations]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-black text-white flex flex-col items-center justify-center gap-6">
        <LoadingIcon className="h-16 w-16 animate-bounce text-spotify-green" />
        <div className="text-xl font-medium text-spotify-lightgray animate-pulse">
          Creating Your Cultural Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black via-spotify-black to-spotify-darkgray text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-12">
          <HeadphonesIcon className="h-12 w-12 text-spotify-green" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-spotify-lightgray bg-clip-text text-transparent">
            Your Cultural Profile
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <TopArtists artists={topArtists} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Music2 className="h-6 w-6 text-spotify-green" />
              <h2 className="text-2xl font-semibold">AI-Powered Recommendations</h2>
            </div>
            <RecommendationGrid 
              recommendations={recommendations} 
              musicData={musicData}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;