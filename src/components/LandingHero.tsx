import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingHero = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // For now, we'll just navigate to the dashboard
    // We'll implement actual Spotify auth later
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-spotify-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Discover Your Cultural Universe
        </h1>
        <p className="text-xl md:text-2xl text-spotify-lightgray mb-8">
          Turn your music taste into personalized recommendations for books, fashion, and travel destinations.
        </p>
        <Button 
          onClick={handleLogin}
          className="bg-spotify-green hover:bg-spotify-green/90 text-white px-8 py-6 text-lg rounded-full"
        >
          Connect with Spotify
        </Button>
      </div>
    </div>
  );
};

export default LandingHero;