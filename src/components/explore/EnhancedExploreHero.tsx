
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Globe, BookOpen, Headphones, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnhancedExploreHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const EnhancedExploreHero = ({ searchTerm, onSearchChange }: EnhancedExploreHeroProps) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const quickFilters = [
    { id: "all", label: "All Stories", icon: Globe, count: "1,200+" },
    { id: "interactive", label: "Interactive", icon: BookOpen, count: "450+" },
    { id: "audio", label: "Audio Stories", icon: Headphones, count: "380+" },
    { id: "collaborative", label: "Collaborative", icon: Users, count: "200+" },
  ];

  const trendingTags = [
    "African Folklore", "Indigenous Stories", "Family Traditions", 
    "Historical Narratives", "Cultural Celebrations", "Migration Stories"
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-heritage-purple/5 via-background to-cultural-gold/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 cultural-pattern opacity-20" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-heritage-purple/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-heritage-purple/10 border border-heritage-purple/20 mb-6">
            <Globe className="h-4 w-4 text-heritage-purple mr-2" />
            <span className="text-sm font-medium text-heritage-purple">
              Explore Cultural Stories
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
              Discover & Connect
            </span>
            <br />
            <span className="text-foreground">
              Through Stories
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Explore immersive narratives, audio stories, and collaborative creations 
            from our vibrant global community of storytellers.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search stories, creators, cultures, or themes..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-16 h-14 text-lg bg-background/80 backdrop-blur-sm border-border/50 focus:border-heritage-purple/50 focus:ring-heritage-purple/20 rounded-xl shadow-lg"
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-heritage-purple hover:bg-heritage-purple/90"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {quickFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                  ${activeFilter === filter.id 
                    ? "bg-heritage-purple hover:bg-heritage-purple/90 text-white" 
                    : "hover:bg-heritage-purple/10 hover:border-heritage-purple/30 hover:text-heritage-purple"
                  }
                `}
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.label}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </motion.div>

          {/* Trending Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Trending themes:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingTags.map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-3 py-1 text-sm bg-cultural-gold/10 text-cultural-gold border border-cultural-gold/20 rounded-full hover:bg-cultural-gold/20 transition-colors"
                  onClick={() => onSearchChange(tag)}
                >
                  #{tag.replace(/\s+/g, '')}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Discovery Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { label: "Stories", value: "1,200+", color: "heritage-purple" },
            { label: "Creators", value: "350+", color: "cultural-gold" },
            { label: "Cultures", value: "50+", color: "heritage-purple" },
            { label: "Languages", value: "25+", color: "cultural-gold" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`
                text-center p-4 rounded-lg bg-${stat.color}/5 border border-${stat.color}/20 
                hover:border-${stat.color}/30 transition-colors group
              `}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`text-2xl font-bold text-${stat.color} mb-1 group-hover:scale-110 transition-transform`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedExploreHero;
