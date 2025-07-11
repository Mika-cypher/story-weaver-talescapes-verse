
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  Globe, 
  Star, 
  ArrowRight, 
  Play,
  Mic,
  Image,
  Headphones,
  Heart,
  Share2,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const steps = [
  {
    number: "01",
    title: "Discover Stories",
    description: "Browse our rich collection of African stories, from ancient folktales to contemporary narratives.",
    icon: BookOpen,
    color: "from-orange-500 to-red-500",
    demo: "Click on any story card to start reading"
  },
  {
    number: "02", 
    title: "Create & Share",
    description: "Use our story builder to craft your own tales with multimedia elements.",
    icon: Mic,
    color: "from-blue-500 to-purple-500",
    demo: "Try the story editor with voice recording"
  },
  {
    number: "03",
    title: "Connect",
    description: "Join the community, follow storytellers, and participate in cultural challenges.",
    icon: Users,
    color: "from-green-500 to-teal-500", 
    demo: "Explore community features"
  },
  {
    number: "04",
    title: "Preserve Culture",
    description: "Help preserve African heritage by sharing traditional stories and wisdom.",
    icon: Globe,
    color: "from-purple-500 to-pink-500",
    demo: "Learn about cultural categories"
  }
];

const features = [
  {
    title: "Interactive Stories",
    description: "Stories with audio narration, images, and choices",
    icon: Play,
    benefits: ["Immersive experience", "Multiple media types", "Choose your path"]
  },
  {
    title: "Cultural Categories",
    description: "Stories organized by African traditions and regions",
    icon: Globe,
    benefits: ["Easy discovery", "Cultural context", "Educational value"]
  },
  {
    title: "Community Features", 
    description: "Connect with storytellers and fellow readers",
    icon: Users,
    benefits: ["Follow creators", "Join challenges", "Share feedback"]
  },
  {
    title: "Creator Tools",
    description: "Professional tools for crafting multimedia stories",
    icon: Mic,
    benefits: ["Voice recording", "Image uploads", "Story branching"]
  }
];

const About: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-heritage-purple/10 via-background to-cultural-gold/10">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-4">
                <Globe className="h-4 w-4 mr-2" />
                Preserving African Heritage Through Stories
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                About
                <span className="block bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
                  Talescapes
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Talescapes is a digital platform dedicated to preserving, sharing, and celebrating 
                African storytelling traditions through interactive multimedia experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-heritage-purple hover:bg-heritage-purple/90">
                  <Link to="/explore">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Explore Stories
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/signup">
                    <Users className="h-5 w-5 mr-2" />
                    Join Community
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How Talescapes Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover how our platform makes African storytelling accessible and engaging for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white`}>
                        <step.icon className="h-8 w-8" />
                      </div>
                      <div className="text-4xl font-bold text-muted-foreground/20 mb-2">
                        {step.number}
                      </div>
                      <CardTitle className="group-hover:text-heritage-purple transition-colors">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveDemo(activeDemo === step.number ? null : step.number)}
                        className="text-heritage-purple hover:text-heritage-purple/80"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Try Demo
                      </Button>
                      {activeDemo === step.number && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 p-3 bg-heritage-purple/10 rounded-lg text-sm"
                        >
                          {step.demo}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to discover, create, and share African stories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-heritage-purple/10 rounded-lg flex items-center justify-center mr-4">
                          <feature.icon className="h-6 w-6 text-heritage-purple" />
                        </div>
                        <div>
                          <CardTitle>{feature.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-cultural-gold mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We believe that stories are the threads that weave cultures together. 
                Talescapes exists to ensure that African storytelling traditions continue 
                to thrive in the digital age, connecting generations and preserving wisdom 
                for future storytellers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-heritage-purple mb-2">500+</div>
                  <div className="text-muted-foreground">African Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cultural-gold mb-2">50+</div>
                  <div className="text-muted-foreground">Cultural Traditions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-heritage-purple mb-2">1000+</div>
                  <div className="text-muted-foreground">Community Members</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-heritage-purple to-cultural-gold">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of storytellers and story-lovers in preserving African heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-heritage-purple" asChild>
                <Link to="/explore">
                  Explore Stories
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
