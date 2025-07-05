
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { StoryForm } from "@/components/story/StoryForm";
import { useAuth } from "@/contexts/AuthContext";
import { useStoryCreation } from "@/hooks/useStoryCreation";

const Create = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const {
    title,
    setTitle,
    excerpt,
    setExcerpt,
    category,
    setCategory,
    content,
    setContent,
    handleSaveDraft,
    handlePreview,
    handlePublish,
  } = useStoryCreation();

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to write stories",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isLoggedIn, navigate, toast]);

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <StoryForm 
        title={title}
        setTitle={setTitle}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
        category={category}
        setCategory={setCategory}
        content={content}
        setContent={setContent}
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        onPublish={handlePublish}
      />
    </div>
  );
};

export default Create;
