
import React from "react";
import { Button } from "@/components/ui/button";
import { Box, Headset, Tablet, Laptop } from "lucide-react";
import { motion } from "framer-motion";

const ImmersiveExperience: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Immersive Cultural Experiences</h2>
            <p className="text-muted-foreground mb-6">
              Step into stories and cultural traditions through our immersive experiences. 
              Using cutting-edge AR and VR technology, we bring African heritage to life,
              allowing you to experience cultural narratives in a whole new dimension.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mt-1">
                  <Headset className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Virtual Reality Journeys</h3>
                  <p className="text-muted-foreground text-sm">
                    Step into fully immersive environments that bring cultural stories to life
                    through VR headsets, with spatial audio and interactive elements.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mt-1">
                  <Tablet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Augmented Reality Overlays</h3>
                  <p className="text-muted-foreground text-sm">
                    Use your mobile device to see cultural artifacts, traditional attire, and
                    storytelling elements brought to life in your own environment.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mt-1">
                  <Laptop className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Web-Based 3D Experiences</h3>
                  <p className="text-muted-foreground text-sm">
                    Access immersive cultural experiences directly in your browser,
                    with interactive 3D environments that tell stories in new ways.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button>
                <Box className="h-4 w-4 mr-2" />
                Explore Immersive Experiences
              </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-square relative">
              <motion.div 
                className="absolute inset-0 rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="VR Cultural Experience" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end">
                  <div className="p-6">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Featured Experience
                    </span>
                    <h3 className="text-white text-xl font-bold mt-2">Ancestral Wisdom Journey</h3>
                    <p className="text-white/80 text-sm">
                      A virtual expedition through traditional African wisdom teachings
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute w-2/3 h-2/3 top-0 right-0 translate-x-1/4 -translate-y-1/4 rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, x: "30%", y: "-30%" }}
                whileInView={{ opacity: 1, x: "20%", y: "-20%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1540867483682-c86762cad38d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="AR Cultural Experience" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImmersiveExperience;
