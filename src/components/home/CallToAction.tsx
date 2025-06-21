
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-heritage-ochre via-heritage-terracotta to-heritage-mud-cloth text-white relative overflow-hidden">
      <div className="absolute inset-0 kente-accent opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Share Your Heritage?
        </h2>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
          Join our community of African storytellers and cultural preservationists. 
          Your voice adds to the rich tapestry of our shared heritage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" asChild>
            <Link to="/create">Begin Your Tale</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50" asChild>
            <Link to="/explore">Discover Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
