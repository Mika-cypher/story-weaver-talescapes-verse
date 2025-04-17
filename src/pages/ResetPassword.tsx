
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ResetPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = (values: ResetFormValues) => {
    // In a real app, this would send a password reset email
    console.log("Reset password for:", values.email);
    
    // Show success message and update UI
    toast({
      title: "Reset link sent",
      description: "Check your email for a link to reset your password",
    });
    
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
              <CardDescription>
                {submitted 
                  ? "Check your email for a reset link"
                  : "Enter your email to receive a password reset link"}
              </CardDescription>
            </CardHeader>
            {submitted ? (
              <CardContent className="pt-4 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    If an account exists with the email you entered, we've sent a link to reset your password.
                  </p>
                  <Link to="/login" className="text-primary hover:underline">
                    Return to login
                  </Link>
                </div>
              </CardContent>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="you@example.com" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full">
                      Send reset link
                    </Button>
                    <div className="text-center text-sm">
                      Remember your password?{" "}
                      <Link to="/login" className="text-primary hover:underline">
                        Sign in
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
