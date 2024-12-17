import { Button } from "@/components/ui/button";
import { spotifyApi } from "@/lib/spotify";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const LandingHero = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log('Starting Spotify authentication...');
      const result = await spotifyApi.authenticate();
      console.log('Authentication result:', result);
      
      if (result.authenticated) {
        toast({
          title: "Successfully connected to Spotify",
          description: "Redirecting to dashboard...",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to connect to Spotify. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black flex flex-col items-center justify-center text-white p-8">
      <h1 className="text-5xl font-bold mb-6 text-center">
        Discover Your Cultural Profile
      </h1>
      <p className="text-xl mb-12 text-center max-w-2xl text-spotify-lightgray">
        Connect with Spotify to get personalized recommendations for books, fashion, and travel based on your music taste.
      </p>
      <Button
        onClick={handleLogin}
        className="bg-spotify-green hover:bg-spotify-green/90 text-white px-8 py-6 text-lg rounded-full"
      >
        Connect with Spotify
      </Button>
    </div>
  );
};

export default LandingHero;