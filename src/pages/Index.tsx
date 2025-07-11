
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, BookOpen, Users } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const { showReminder, setShowReminder } = useSignUpReminder(15000);

  useEffect(() => {
    // Welcome toast
    toast({
      title: "Welcome to Talescapes! 🌍",
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
        
        {/* About Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <Globe className="h-4 w-4 mr-2" />
                About Talescapes
              </Badge>
              
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                To become the leading digital home for African storytelling—empowering creators, 
                preserving heritage, and redefining how stories are experienced through immersive 
                and interactive technology.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <Card className="border-2 border-transparent hover:border-heritage-purple/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-heritage-purple" />
                    <h3 className="text-xl font-semibold mb-2">Preserve Heritage</h3>
                    <p className="text-muted-foreground">
                      Digital preservation of African oral traditions and cultural wisdom
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-transparent hover:border-heritage-purple/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-cultural-gold" />
                    <h3 className="text-xl font-semibold mb-2">Empower Creators</h3>
                    <p className="text-muted-foreground">
                      Supporting African storytellers with tools and community
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-transparent hover:border-heritage-purple/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-heritage-purple" />
                    <h3 className="text-xl font-semibold mb-2">Connect Cultures</h3>
                    <p className="text-muted-foreground">
                      Bridging generations through immersive storytelling experiences
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
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
