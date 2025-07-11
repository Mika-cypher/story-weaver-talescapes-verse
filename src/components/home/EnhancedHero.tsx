import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Globe, Star, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const EnhancedHero: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const culturalHighlights = [
    {
      title: "West African Folktales",
      description: "Anansi stories and Yoruba wisdom",
      icon: "🕷️",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "East African Legends", 
      description: "Swahili tales and Ethiopian myths",
      icon: "🦁",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Southern African Stories",
      description: "Ubuntu philosophy and Zulu narratives",
      icon: "🌍",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Ancient Wisdom",
      description: "Ancestral knowledge and traditions",
      icon: "⚡",
      color: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-heritage-purple/10 via-background to-cultural-gold/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-heritage-purple/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cultural-gold/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-heritage-purple/10 to-cultural-gold/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main hero content */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
                <Globe className="h-4 w-4 mr-2" />
                Preserving African Heritage Through Stories
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                African Stories
                <span className="block bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
                  Come Alive
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Experience the rich tapestry of African storytelling traditions through 
                interactive multimedia narratives that preserve culture and connect generations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              {isLoggedIn ? (
                <>
                  <Button asChild size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-heritage-purple to-cultural-gold hover:from-heritage-purple/90 hover:to-cultural-gold/90">
                    <Link to="/explore">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Explore African Stories
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                    <Link to="/create">
                      <Play className="h-5 w-5 mr-2" />
                      Share Your Story
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-heritage-purple to-cultural-gold hover:from-heritage-purple/90 hover:to-cultural-gold/90">
                    <Link to="/signup">
                      <Users className="h-5 w-5 mr-2" />
                      Join the Community
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                    <Link to="/explore">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Explore Stories
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-heritage-purple mb-2">500+</div>
                <div className="text-muted-foreground">African Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cultural-gold mb-2">54</div>
                <div className="text-muted-foreground">African Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-heritage-purple mb-2">1000+</div>
                <div className="text-muted-foreground">Storytellers</div>
              </div>
            </motion.div>
          </div>

          {/* Cultural highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {culturalHighlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full border-2 border-transparent group-hover:border-heritage-purple/20 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-heritage-purple transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center mt-16"
          >
            <p className="text-lg text-muted-foreground mb-6">
              {isLoggedIn 
                ? "Ready to discover amazing African stories and connect with storytellers?"
                : "Ready to become part of our African storytelling community?"
              }
            </p>
            <Button asChild variant="ghost" className="group">
              <Link to={isLoggedIn ? "/explore" : "/about"}>
                {isLoggedIn ? "Start Exploring" : "Learn More About Us"}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;
