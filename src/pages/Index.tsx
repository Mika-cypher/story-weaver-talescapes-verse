
import Hero from "@/components/home/Hero";
import FeaturedStories from "@/components/home/FeaturedStories";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import CallToAction from "@/components/home/CallToAction";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Welcome toast when landing on the home page
    toast({
      title: "Welcome to Talescapes!",
      description: (
        <div className="flex items-center gap-2">
          Explore and create immersive interactive stories in our beta version.
          <span className="beta-badge text-xs">BETA</span>
        </div>
      ),
      duration: 6000,
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <FeaturedStories />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
