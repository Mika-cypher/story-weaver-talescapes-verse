
import React from "react";
import { motion } from "framer-motion";

const ArchiveHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cultural Heritage Archive
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Preserving and celebrating African tales, songs, and dialects for future generations through digital storytelling and immersive experiences.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.span 
              className="inline-block bg-muted/30 rounded-full px-3 py-1 text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Oral Traditions
            </motion.span>
            <motion.span 
              className="inline-block bg-muted/30 rounded-full px-3 py-1 text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              Cultural Heritage
            </motion.span>
            <motion.span 
              className="inline-block bg-muted/30 rounded-full px-3 py-1 text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              Indigenous Knowledge
            </motion.span>
            <motion.span 
              className="inline-block bg-muted/30 rounded-full px-3 py-1 text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              Digital Preservation
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchiveHero;
