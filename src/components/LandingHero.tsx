
import { Button } from "@/components/ui/button";
import { spotifyApi } from "@/lib/spotify";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const LandingHero = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle the callback from Spotify
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if we're in a callback situation (URL has a code parameter)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          console.log('Processing Spotify callback with code:', code);
          
          // Clear the URL parameters to clean up the address bar
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Now authenticate with the Spotify SDK using the code
          try {
            const accessToken = await spotifyApi.authenticate();
            console.log('Spotify SDK authenticated successfully');
            
            // Get user profile from Spotify
            const profile = await spotifyApi.currentUser.profile();
            console.log('Spotify profile:', profile);

            // Use email if available, otherwise use Spotify ID
            const userIdentifier = profile.email || `spotify-user-${profile.id}@example.com`;
            console.log('Using identifier:', userIdentifier);

            // Sign in or sign up with Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: userIdentifier,
              password: `spotify-${profile.id}`, // Use Spotify ID as part of password
            });

            if (authError && authError.message.includes('Invalid login credentials')) {
              // User doesn't exist, sign them up
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: userIdentifier,
                password: `spotify-${profile.id}`,
              });

              if (signUpError) {
                console.error('Sign up error:', signUpError);
                throw signUpError;
              }

              // Update profile with Spotify display name
              const { error: profileError } = await supabase
                .from('profiles')
                .update({ 
                  display_name: profile.display_name || `Spotify User ${profile.id}`,
                })
                .eq('id', signUpData.user?.id);

              if (profileError) {
                console.error('Profile update error:', profileError);
              }
            } else if (authError) {
              console.error('Auth error:', authError);
              throw authError;
            }

            toast({
              title: "Successfully connected to Spotify",
              description: "Redirecting to dashboard...",
            });
            navigate('/dashboard');
          } catch (spotifyError) {
            console.error('Spotify SDK authentication failed:', spotifyError);
            throw new Error('Failed to authenticate with Spotify');
          }
        }
      } catch (error) {
        console.error("Callback handling error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to complete Spotify connection. Please try again.",
        });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  const handleLogin = async () => {
    try {
      console.log('Starting Spotify authentication...');
      console.log('Device type:', /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop');
      
      // Manual OAuth flow - more reliable than SDK authenticate()
      const clientId = "45c6b39dac50487b8fadc3a6b2592479";
      const redirectUri = window.location.origin;
      const scopes = [
        "user-read-private",
        "user-top-read", 
        "playlist-read-private",
        "user-read-playback-position",
        "user-read-currently-playing"
      ];
      
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scopes.join(' '),
        redirect_uri: redirectUri,
        show_dialog: 'true'
      });
      
      const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
      console.log('Auth URL:', authUrl);
      console.log('Current origin:', window.location.origin);
      
      // Force immediate redirect - better for desktop browsers
      window.location.assign(authUrl);
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to start Spotify authentication. Please try again.",
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
