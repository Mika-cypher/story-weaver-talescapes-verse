
import EnhancedHero from "@/components/home/EnhancedHero";
import FeaturedStories from "@/components/home/FeaturedStories";
import EnhancedFeatures from "@/components/home/EnhancedFeatures";
import CallToAction from "@/components/home/CallToAction";
import EnhancedNavbar from "@/components/layout/EnhancedNavbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSignUpReminder } from "@/hooks/useSignUpReminder";
import SignUpReminder from "@/components/auth/SignUpReminder";

const Index = () => {
  const { toast } = useToast();
  const { showReminder, setShowReminder } = useSignUpReminder(15000);

  useEffect(() => {
    // Welcome toast with African cultural touch
    toast({
      title: "Karibu to Talescapes! 🌍",
      description: "Discover African stories that preserve heritage and connect cultures.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedNavbar />
      <main className="flex-grow">
        <EnhancedHero />
        <EnhancedFeatures />
        <FeaturedStories />
        <CallToAction />
      </main>
      <Footer />
      
      {/* Sign Up Reminder Dialog */}
      <SignUpReminder 
        open={showReminder} 
        onOpenChange={setShowReminder} 
      />
    </div>
  );
};

export default Index;
