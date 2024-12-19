import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackButtonProps {
  recommendationType: string;
  recommendationTitle: string;
}

export const FeedbackButton = ({ recommendationType, recommendationTitle }: FeedbackButtonProps) => {
  const [isPositive, setIsPositive] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadExistingFeedback = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('recommendation_feedback')
        .select('is_positive')
        .eq('user_id', user.id)
        .eq('recommendation_type', recommendationType)
        .eq('recommendation_title', recommendationTitle)
        .single();

      if (error) {
        console.error('Error loading feedback:', error);
        return;
      }

      if (data) {
        setIsPositive(data.is_positive);
      }
    };

    loadExistingFeedback();
  }, [recommendationType, recommendationTitle]);

  const handleFeedback = async (positive: boolean) => {
    if (isPositive === positive) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to provide feedback",
      });
      return;
    }

    // If there's existing feedback, delete it first
    if (isPositive !== null) {
      const { error: deleteError } = await supabase
        .from('recommendation_feedback')
        .delete()
        .eq('user_id', user.id)
        .eq('recommendation_type', recommendationType)
        .eq('recommendation_title', recommendationTitle);

      if (deleteError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update feedback",
        });
        return;
      }
    }

    const { error } = await supabase
      .from('recommendation_feedback')
      .insert({
        user_id: user.id,
        recommendation_type: recommendationType,
        recommendation_title: recommendationTitle,
        is_positive: positive,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save feedback",
      });
      return;
    }

    setIsPositive(positive);
    toast({
      title: "Thank you!",
      description: "Your feedback helps us improve recommendations",
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback(true)}
        className={`hover:text-spotify-green ${isPositive === true ? 'text-spotify-green' : 'text-spotify-lightgray'}`}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback(false)}
        className={`hover:text-red-500 ${isPositive === false ? 'text-red-500' : 'text-spotify-lightgray'}`}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
};