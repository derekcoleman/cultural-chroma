import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Artist } from "@/types/spotify";

interface TopArtistsProps {
  artists: Artist[];
}

const TopArtists = ({ artists }: TopArtistsProps) => {
  return (
    <Card className="bg-spotify-darkgray border-none text-white overflow-hidden backdrop-blur-lg bg-opacity-50">
      <CardHeader className="border-b border-spotify-lightgray/10">
        <CardTitle className="text-xl font-semibold">Top Artists</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-spotify-lightgray/10">
          {artists.map((artist, index) => (
            <li 
              key={artist.name}
              className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors"
            >
              <span className="text-spotify-lightgray text-sm font-mono w-6">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{artist.name}</h3>
                <p className="text-sm text-spotify-lightgray truncate">
                  {artist.genres.slice(0, 2).join(", ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopArtists;