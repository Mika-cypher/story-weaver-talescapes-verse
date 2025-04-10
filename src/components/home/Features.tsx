
import { 
  BookOpen,
  Headphones, 
  PenSquare, 
  Image, 
  Share2,
  Layers
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <BookOpen className="h-10 w-10 text-tale-purple" />,
    title: "Curated Stories",
    description:
      "Explore a diverse collection of high-quality stories across various genres.",
  },
  {
    icon: <PenSquare className="h-10 w-10 text-tale-purple" />,
    title: "Create Your Story",
    description:
      "Use our intuitive editor to craft your own tales with rich formatting.",
  },
  {
    icon: <Image className="h-10 w-10 text-tale-purple" />,
    title: "Visual Elements",
    description:
      "Add images, illustrations, and visual effects to enhance your storytelling.",
  },
  {
    icon: <Headphones className="h-10 w-10 text-tale-purple" />,
    title: "Audio Integration",
    description:
      "Add narration, ambient sounds, and music to create an immersive experience.",
  },
  {
    icon: <Share2 className="h-10 w-10 text-tale-purple" />,
    title: "Share & Collaborate",
    description:
      "Share your stories with the world and collaborate with other creators.",
  },
  {
    icon: <Layers className="h-10 w-10 text-tale-purple" />,
    title: "Future AR/VR",
    description:
      "Your stories will be ready for our upcoming AR and VR experiences.",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-tale-soft-purple/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Powerful Storytelling Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create immersive, interactive stories that captivate your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
