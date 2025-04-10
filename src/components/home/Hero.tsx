
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-tale-soft-purple/50 to-background pt-32 pb-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-tale-purple/10 animate-float" style={{ animationDelay: "0s" }}></div>
        <div className="absolute top-40 right-10 w-24 h-24 rounded-full bg-tale-gold/10 animate-float" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-tale-blue/10 animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
            >
              Bring Your Stories To Life
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Create immersive stories with visuals and audio in our interactive story platform. Let your imagination flow and share your tales with the world.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Button size="lg" asChild>
                <Link to="/create">Start Creating</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/explore">Explore Stories</Link>
              </Button>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="relative glass-card p-3 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?q=80&w=3540&auto=format&fit=crop" 
                  alt="Storytelling illustration" 
                  className="w-full h-auto rounded"
                />
                <div className="absolute -bottom-4 -right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg transform rotate-2 border border-white/30">
                  <p className="text-sm font-medium text-foreground italic">
                    "The universe is made of stories, not atoms."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
