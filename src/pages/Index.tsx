
import Hero from "@/components/home/Hero";
import FeaturedStories from "@/components/home/FeaturedStories";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import CallToAction from "@/components/home/CallToAction";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Welcome toast when landing on the home page
    toast({
      title: "Welcome to Talescapes!",
      description: "Explore and create immersive interactive stories.",
      duration: 5000,
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
