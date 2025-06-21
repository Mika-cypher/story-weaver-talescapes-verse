
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-tale-purple/90 to-tale-dark-purple/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Bring Your Stories to Life?
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
          Join our community of creators and share your imagination with the world.
          Start creating immersive stories today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/create">Start Creating</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link to="/explore">Explore Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
