
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Write Your Story",
    description:
      "Use our rich text editor to write your story or import an existing one. Add chapters, sections, and format your text.",
    image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=3540&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Add Visuals & Audio",
    description:
      "Enhance your story with images, illustrations, background music, sound effects, and voice narration.",
    image: "https://images.unsplash.com/photo-1619841667465-d8c6254b3c2e?q=80&w=4000&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Preview & Publish",
    description:
      "Preview your immersive story experience, make any final adjustments, and publish it to share with the world.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=3540&auto=format&fit=crop",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How Talescapes Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Creating immersive stories is easy with our intuitive platform.
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 items-center`}
            >
              <div className="lg:w-1/2">
                <div className="relative">
                  <span className="absolute -top-10 -left-8 text-6xl font-bold text-tale-purple/10">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground mb-6">{step.description}</p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="glass-card p-3 shadow-xl">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto rounded-md"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link to="/create">Start Creating Your Story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
