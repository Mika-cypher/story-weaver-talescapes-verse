
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Star, Users, BookOpen } from "lucide-react";

interface AuthPromptProps {
  feature: string;
  description: string;
  benefits?: string[];
  variant?: "card" | "inline" | "overlay";
  className?: string;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  feature,
  description,
  benefits = [],
  variant = "card",
  className = ""
}) => {
  const defaultBenefits = [
    "Save your favorite stories",
    "Create and share your own stories",
    "Connect with other storytellers",
    "Personalized recommendations"
  ];

  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits;

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-dashed ${className}`}>
        <Lock className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{feature}</span> requires an account. {description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className={`absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 ${className}`}>
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Join Talescapes</CardTitle>
            <p className="text-muted-foreground">
              {description}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {displayBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-cultural-gold" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {feature}
          </CardTitle>
          <Badge variant="secondary">Sign up required</Badge>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {displayBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-cultural-gold" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link to="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
