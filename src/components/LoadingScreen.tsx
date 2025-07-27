import { useEffect, useState } from "react";
import { 
  Music, 
  Music3,
  Music4,
  Headphones,
  Guitar,
  Piano,
  Disc,
  Radio,
  Mic2,
  Speaker
} from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps = {}) => {
  const [iconIndex, setIconIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Creating Your Cultural Profile...");
  
  const icons = [
    <Music className="h-16 w-16" />,
    <Music3 className="h-16 w-16" />,
    <Music4 className="h-16 w-16" />,
    <Headphones className="h-16 w-16" />,
    <Guitar className="h-16 w-16" />,
    <Piano className="h-16 w-16" />,
    <Disc className="h-16 w-16" />,
    <Radio className="h-16 w-16" />,
    <Mic2 className="h-16 w-16" />,
    <Speaker className="h-16 w-16" />
  ];

  const loadingMessages = [
    "Creating Your Cultural Profile...",
    "Analyzing Your Music Taste...",
    "Generating Personalized Recommendations...",
    "Almost There! Fine-tuning Your Profile..."
  ];

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 80);

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < loadingMessages.length - 1) {
        messageIndex++;
        setLoadingMessage(loadingMessages[messageIndex]);
      }
    }, 3000);

    // More realistic progress that corresponds to actual loading stages
    const progressSteps = [
      { time: 500, progress: 10 },   // Initial connection
      { time: 1500, progress: 25 },  // Authenticating
      { time: 3000, progress: 45 },  // Fetching data
      { time: 5000, progress: 70 },  // Processing data
      { time: 8000, progress: 85 },  // Generating recommendations
      // Will reach 100% when actually done
    ];

    const progressTimeouts = progressSteps.map(({ time, progress }) =>
      setTimeout(() => setProgress(progress), time)
    );

    return () => {
      clearInterval(iconInterval);
      clearInterval(messageInterval);
      progressTimeouts.forEach(clearTimeout);
    };
  }, []);

  // Handle completion when onComplete is provided
  useEffect(() => {
    if (onComplete) {
      setProgress(100);
      const completeTimeout = setTimeout(onComplete, 300);
      return () => clearTimeout(completeTimeout);
    }
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-spotify-black text-white flex flex-col items-center justify-center gap-6">
      <div className="text-spotify-green animate-bounce">
        {icons[iconIndex]}
      </div>
      <div className="text-xl font-medium text-spotify-lightgray animate-pulse">
        {loadingMessage}
      </div>
      <div className="w-64 h-2 bg-spotify-darkgray rounded-full overflow-hidden">
        <div 
          className="h-full bg-spotify-green transition-all duration-200 ease-in-out animate-shimmer"
          style={{ 
            width: `${progress}%`,
            backgroundImage: 'linear-gradient(90deg, rgba(29,185,84,0.8) 0%, #1DB954 50%, rgba(29,185,84,0.8) 100%)',
            backgroundSize: '200% 100%'
          }}
        />
      </div>
      {progress >= 70 && (
        <div className="text-sm text-spotify-lightgray mt-2 max-w-md text-center animate-fade-in">
          We're processing your music data to create the perfect recommendations. This might take a few more seconds...
        </div>
      )}
    </div>
  );
};