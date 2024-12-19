import { useState, useEffect } from "react";
import { UserCircle, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ProfileSection } from "./ProfileSection";
import { useToast } from "@/components/ui/use-toast";

export const ProfileMenu = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile information",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsProfileOpen(open);
    // Ensure dropdown is closed when dialog is closed
    if (!open) {
      setDropdownOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
      : '?';
  };

  if (!profile) return null;

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar className="h-8 w-8 border border-spotify-lightgray/20">
            <AvatarFallback className="bg-spotify-darkgray text-white">
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-spotify-darkgray border-spotify-lightgray/20">
          <DropdownMenuLabel className="text-white">
            {profile.display_name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-spotify-lightgray/20" />
          <DropdownMenuItem
            className="text-white cursor-pointer hover:bg-spotify-lightgray/10"
            onClick={() => {
              setIsProfileOpen(true);
              setDropdownOpen(false);
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-white cursor-pointer hover:bg-spotify-lightgray/10"
            onClick={handleSignOut}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isProfileOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="bg-spotify-darkgray border-spotify-lightgray/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
          </DialogHeader>
          <ProfileSection onClose={() => setIsProfileOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};