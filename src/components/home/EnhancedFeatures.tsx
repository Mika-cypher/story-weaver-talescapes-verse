
import { 
  BookOpen, 
  Users, 
  Globe2, 
  Headphones, 
  Palette, 
  Heart,
  Sparkles,
  Archive,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";

const EnhancedFeatures = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Immersive Storytelling",
      description: "Create rich, interactive narratives with multimedia elements, branching storylines, and cultural context.",
      color: "heritage-purple",
      gradient: "from-heritage-purple/10 to-heritage-purple/5"
    },
    {
      icon: Globe2,
      title: "Cultural Heritage",
      description: "Preserve and share traditional stories, folklore, and cultural wisdom from communities worldwide.",
      color: "cultural-gold",
      gradient: "from-cultural-gold/10 to-cultural-gold/5"
    },
    {
      icon: Users,
      title: "Community Collaboration",
      description: "Connect with storytellers, collaborate on projects, and build a global network of cultural creators.",
      color: "heritage-purple",
      gradient: "from-heritage-purple/10 to-heritage-purple/5"
    },
    {
      icon: Headphones,
      title: "Audio Narratives",
      description: "Record and share audio stories with ambient sounds, music, and multiple language support.",
      color: "cultural-gold",
      gradient: "from-cultural-gold/10 to-cultural-gold/5"
    },
    {
      icon: Palette,
      title: "Visual Storytelling",
      description: "Enhance your stories with images, illustrations, and cultural artwork that brings narratives to life.",
      color: "heritage-purple",
      gradient: "from-heritage-purple/10 to-heritage-purple/5"
    },
    {
      icon: Archive,
      title: "Cultural Archive",
      description: "Access a curated collection of traditional stories, historical narratives, and cultural documentation.",
      color: "cultural-gold",
      gradient: "from-cultural-gold/10 to-cultural-gold/5"
    },
    {
      icon: MessageCircle,
      title: "Community Discussions",
      description: "Engage in meaningful conversations about stories, share cultural insights, and learn from diverse perspectives.",
      color: "heritage-purple",
      gradient: "from-heritage-purple/10 to-heritage-purple/5"
    },
    {
      icon: Heart,
      title: "Cultural Sensitivity",
      description: "Built-in guidelines and community moderation ensure respectful representation of all cultures and traditions.",
      color: "cultural-gold",
      gradient: "from-cultural-gold/10 to-cultural-gold/5"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-heritage-purple/10 border border-heritage-purple/20 mb-6">
            <Sparkles className="h-4 w-4 text-heritage-purple mr-2" />
            <span className="text-sm font-medium text-heritage-purple">
              Platform Features
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-heritage-purple">Empower Your</span>
            <br />
            <span className="bg-gradient-to-r from-cultural-gold to-heritage-purple bg-clip-text text-transparent">
              Storytelling Journey
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover powerful tools designed to help you create, share, and preserve 
            cultural stories while connecting with a global community of storytellers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
            >
              <div className={`
                relative p-6 rounded-xl border border-border/50 bg-gradient-to-br ${feature.gradient}
                hover:border-${feature.color}/30 transition-all duration-300 hover:shadow-lg
                hover:shadow-${feature.color}/10 h-full
              `}>
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4
                  group-hover:bg-${feature.color}/20 transition-colors
                `}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-3 group-hover:text-heritage-purple transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-heritage-purple/5 to-cultural-gold/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="heritage-card max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cultural-gradient rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-heritage-purple mb-4">
                Ready to Share Your Story?
              </h3>
              
              <p className="text-muted-foreground mb-6 max-w-md">
                Join thousands of storytellers preserving and sharing cultural heritage 
                through the power of narrative.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-cultural-gradient text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Creating Today
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border border-heritage-purple/30 text-heritage-purple rounded-lg font-semibold hover:bg-heritage-purple/10 transition-colors"
                >
                  Explore Stories
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedFeatures;
