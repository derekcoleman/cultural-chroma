import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, UserCircle, Pencil, Save } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  preferred_categories: string[];
}

export const ProfileSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
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
    setEditedProfile(data);
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if preferred categories have changed
    const categoriesChanged = JSON.stringify(profile?.preferred_categories) !== JSON.stringify(editedProfile.preferred_categories);

    const { error } = await supabase
      .from('profiles')
      .update(editedProfile)
      .eq('id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
      return;
    }

    // If categories changed, clear cached recommendations
    if (categoriesChanged) {
      const { error: cacheError } = await supabase
        .from('cached_recommendations')
        .delete()
        .eq('user_id', user.id);

      if (cacheError) {
        console.error('Error clearing cached recommendations:', cacheError);
      }
    }

    setProfile({ ...profile, ...editedProfile } as Profile);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const toggleCategory = (categoryId: string) => {
    const currentCategories = editedProfile.preferred_categories || [];
    const updatedCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(c => c !== categoryId)
      : [...currentCategories, categoryId];
    
    setEditedProfile(prev => ({
      ...prev,
      preferred_categories: updatedCategories,
    }));
  };

  if (!profile) return null;

  return (
    <div className="bg-spotify-darkgray rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UserCircle className="h-8 w-8 text-spotify-green" />
          <h2 className="text-xl font-semibold">Your Profile</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className="bg-spotify-darkgray border-spotify-lightgray/20 text-white hover:bg-white/10"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-spotify-lightgray mb-2 block">Display Name</label>
          {isEditing ? (
            <Input
              value={editedProfile.display_name || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, display_name: e.target.value }))}
              className="bg-spotify-black border-spotify-lightgray/20"
            />
          ) : (
            <p>{profile.display_name || 'No display name set'}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-spotify-lightgray mb-2 block">Bio</label>
          {isEditing ? (
            <Textarea
              value={editedProfile.bio || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
              className="bg-spotify-black border-spotify-lightgray/20"
            />
          ) : (
            <p>{profile.bio || 'No bio set'}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-spotify-lightgray mb-2 block">Preferred Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter(cat => cat.id !== 'all').map((category) => (
              <Badge
                key={category.id}
                variant={isEditing ? "outline" : "secondary"}
                className={`cursor-${isEditing ? 'pointer' : 'default'} ${
                  (editedProfile.preferred_categories || []).includes(category.id)
                    ? 'bg-spotify-green text-white'
                    : ''
                }`}
                onClick={() => isEditing && toggleCategory(category.id)}
              >
                {category.icon && <category.icon className="h-3 w-3 mr-1" />}
                {category.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};