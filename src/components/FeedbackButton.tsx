import { useState } from "react";
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