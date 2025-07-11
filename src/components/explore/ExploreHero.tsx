
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ExploreHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ExploreHero = ({ searchTerm, onSearchChange }: ExploreHeroProps) => {
  return (
    <section className="bg-gradient-to-b from-muted/50 to-background py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Explore & Connect
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover amazing stories, audio narrations, and connect with creators from our vibrant community
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories, audio, creators..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreHero;
