import { Button } from "@/components/ui/button";
import { spotifyApi } from "@/lib/spotify";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LandingHero = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log('Starting Spotify authentication...');
      const result = await spotifyApi.authenticate();
      console.log('Authentication result:', result);
      
      if (result) {
        // Get Spotify user profile
        const profile = await spotifyApi.currentUser.profile();
        console.log('Spotify profile:', profile);

        if (!profile.email) {
          throw new Error('Email not available from Spotify profile');
        }

        // Try to sign in first
        let { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: profile.email,
          password: `spotify-${profile.id}`,
        });

        // If sign in fails, create a new account
        if (signInError) {
          console.log('User does not exist, creating new account...');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: profile.email,
            password: `spotify-${profile.id}`,
          });

          if (signUpError) {
            console.error('Error creating user:', signUpError);
            throw signUpError;
          }

          authData = signUpData;

          // Update the profile with Spotify data
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              display_name: profile.display_name,
            })
            .eq('id', signUpData.user?.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }

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