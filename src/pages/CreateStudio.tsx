
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { StoryCreationStudio } from "@/components/story/StoryCreationStudio";

const CreateStudio: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the Story Creation Studio",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isLoggedIn, navigate, toast]);

  if (!isLoggedIn) {
    return null;
  }

  return <StoryCreationStudio />;
};

export default CreateStudio;
