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

export const LoadingScreen = () => {
  const [iconIndex, setIconIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
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

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 80);

    // Instead of resetting to 0, we'll make the progress bar move more slowly
    // and stop at 90% until the actual loading is complete
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + 0.3; // Slower increment
        }
        return prev;
      });
    }, 50);

    return () => {
      clearInterval(iconInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-spotify-black text-white flex flex-col items-center justify-center gap-6">
      <div className="text-spotify-green animate-bounce">
        {icons[iconIndex]}
      </div>
      <div className="text-xl font-medium text-spotify-lightgray animate-pulse">
        Creating Your Cultural Profile...
      </div>
      <div className="w-64 h-2 bg-spotify-darkgray rounded-full overflow-hidden">
        <div 
          className="h-full bg-spotify-green transition-all duration-200 ease-in-out"
          style={{ 
            width: `${progress}%`,
            backgroundImage: 'linear-gradient(90deg, rgba(29,185,84,0.8) 0%, #1DB954 50%, rgba(29,185,84,0.8) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1s infinite linear'
          }}
        />
      </div>
    </div>
  );
};