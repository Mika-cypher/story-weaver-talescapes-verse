
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileAudio, FileText, Languages } from "lucide-react";
import { Link } from "react-router-dom";

const ContributeSection: React.FC = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contribute to the Archive</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help preserve cultural heritage by contributing stories, songs, or language
            recordings from your community or culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Share a Story</h3>
            <p className="text-muted-foreground mb-4">
              Contribute traditional folktales, myths, legends, or personal narratives from your culture.
            </p>
            <Button className="w-full" asChild>
              <Link to="/contribute/story">
                <Upload className="h-4 w-4 mr-2" />
                Submit Story
              </Link>
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileAudio className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Record a Song</h3>
            <p className="text-muted-foreground mb-4">
              Share traditional songs, chants, or musical performances from your cultural heritage.
            </p>
            <Button className="w-full" asChild>
              <Link to="/contribute/song">
                <Upload className="h-4 w-4 mr-2" />
                Submit Recording
              </Link>
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Languages className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Preserve Language</h3>
            <p className="text-muted-foreground mb-4">
              Contribute recordings of indigenous languages, dialects, or phrases to help preserve linguistic heritage.
            </p>
            <Button className="w-full" asChild>
              <Link to="/contribute/language">
                <Upload className="h-4 w-4 mr-2" />
                Submit Language
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            All contributions are reviewed by our team before being added to the archive.
            Help us preserve cultural heritage for future generations.
          </p>
          <Button variant="outline" asChild>
            <Link to="/contribute/guidelines">
              Contribution Guidelines
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContributeSection;
