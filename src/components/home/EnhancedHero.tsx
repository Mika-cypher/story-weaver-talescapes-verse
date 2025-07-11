
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Globe, Sparkles, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const EnhancedHero = () => {
  const stats = [
    { label: "Stories Shared", value: "1,000+", icon: BookOpen },
    { label: "Active Creators", value: "250+", icon: Users },
    { label: "Cultural Traditions", value: "50+", icon: Globe },
    { label: "Community Members", value: "5,000+", icon: Sparkles },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 cultural-pattern opacity-30" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-heritage-purple/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-cultural-gold/10 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-heritage-purple/10 border border-heritage-purple/20 mb-6">
              <Sparkles className="h-4 w-4 text-heritage-purple mr-2" />
              <span className="text-sm font-medium text-heritage-purple">
                Celebrating Cultural Heritage Through Stories
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
                Weave Stories
              </span>
              <br />
              <span className="text-foreground">
                Bridge Cultures
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Discover, create, and share immersive stories that celebrate the rich tapestry of human culture. 
              Connect with storytellers from around the world and preserve heritage for future generations.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button 
              size="lg" 
              className="bg-cultural-gradient hover:opacity-90 text-white px-8 py-6 text-lg font-semibold group"
              asChild
            >
              <Link to="/explore">
                <BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Explore Stories
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-heritage-purple/30 text-heritage-purple hover:bg-heritage-purple/10 px-8 py-6 text-lg font-semibold group"
              asChild
            >
              <Link to="/create">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Creating
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-heritage-purple/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-heritage-purple" />
                <div className="text-2xl font-bold text-heritage-purple mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Featured Story Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="heritage-card group cursor-pointer">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-cultural-gradient rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-heritage-purple">
                      Featured Story
                    </h3>
                    <p className="text-muted-foreground">
                      From the African Diaspora Collection
                    </p>
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-3 group-hover:text-heritage-purple transition-colors">
                  The Wisdom of Anansi
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Journey through West African folklore with this interactive tale of Anansi the spider, 
                  exploring themes of wisdom, cunning, and community that have been passed down through generations.
                </p>
              </div>
              <div className="w-full md:w-80 h-48 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2748&auto=format&fit=crop"
                  alt="African traditional art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedHero;
