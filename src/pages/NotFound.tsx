
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";

const NotFound = () => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route"
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-tale-soft-purple/30 px-4">
      <div className="text-center max-w-md glass-card p-8 md:p-12">
        <h1 className="text-6xl font-bold text-tale-purple mb-4">404</h1>
        <p className="text-2xl text-foreground mb-6">This story page doesn't exist</p>
        <p className="text-muted-foreground mb-8">
          The tale you're looking for may have wandered off into another realm. Let's get you back to familiar territory.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return Home
            </Link>
          </Button>
          <Button asChild>
            <Link to="/explore">
              <BookOpen className="h-4 w-4 mr-2" />
              Explore Stories
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
