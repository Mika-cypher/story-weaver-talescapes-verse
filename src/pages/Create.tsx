
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { StoryForm } from "@/components/story/StoryForm";
import { CreatePageHeader } from "@/components/create/CreatePageHeader";
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CreatePageHeader />

          <Card className="shadow-lg">
            <CardContent className="p-8">
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
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
