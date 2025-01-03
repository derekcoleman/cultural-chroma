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
          console.log('Processing Spotify callback...');
          
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
      // This will redirect to Spotify's authorization page
      await spotifyApi.authenticate();
    } catch (error) {
      console.error("Login error:", error);
      // We don't show an error toast here since we're redirecting to Spotify
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