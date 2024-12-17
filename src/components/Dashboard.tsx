import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockTopArtists = [
  { name: "The National", genre: "Indie Rock" },
  { name: "Bon Iver", genre: "Folk" },
  { name: "Four Tet", genre: "Electronic" },
];

const mockRecommendations = [
  {
    type: "Book",
    title: "On the Road by Jack Kerouac",
    reason: "Based on your indie folk preferences",
    link: "#",
  },
  {
    type: "Travel",
    title: "Portland, Oregon",
    reason: "A hub for indie music and culture",
    link: "#",
  },
  {
    type: "Fashion",
    title: "Vintage Denim Jacket",
    reason: "Matches your alternative music taste",
    link: "#",
  },
];

const Dashboard = () => {
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
                {mockTopArtists.map((artist) => (
                  <li key={artist.name} className="flex justify-between items-center">
                    <span className="font-medium">{artist.name}</span>
                    <span className="text-spotify-lightgray">{artist.genre}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockRecommendations.map((item) => (
            <Card key={item.title} className="bg-spotify-darkgray border-none text-white hover:ring-2 hover:ring-spotify-green transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{item.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-spotify-lightgray">{item.reason}</p>
                <a 
                  href={item.link}
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