import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Artist } from "@/types/spotify";

interface TopArtistsProps {
  artists: Artist[];
}

const TopArtists = ({ artists }: TopArtistsProps) => {
  return (
    <Card className="bg-spotify-darkgray border-none text-white">
      <CardHeader>
        <CardTitle>Top Artists</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {artists.map((artist) => (
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
  );
};

export default TopArtists;