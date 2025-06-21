
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { StorySubmissionWizard } from "@/components/user/StorySubmissionWizard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Award } from "lucide-react";

const Submit: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Share Your Story</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Contribute to our cultural heritage archive by sharing your stories, traditions, and experiences.
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Login Required</CardTitle>
                <CardDescription>
                  Please sign in to submit your story to our archive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <a href="/login">Sign In</a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="/signup">Create Account</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Share Your Story</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Contribute to our cultural heritage archive by sharing your stories, traditions, and experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Share Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Submit traditional tales, personal narratives, or cultural stories from your community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Community Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  All submissions are reviewed by our community to ensure quality and authenticity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Preserve Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Help preserve cultural heritage for future generations to discover and enjoy.
                </p>
              </CardContent>
            </Card>
          </div>

          <StorySubmissionWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Submit;
