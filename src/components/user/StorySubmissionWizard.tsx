
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmissionOperations } from "@/hooks/useSubmissionOperations";
import { FileText, Upload, CheckCircle } from "lucide-react";

interface StorySubmissionFormData {
  title: string;
  description: string;
  category: string;
  culturalOrigin: string;
  content: string;
}

export const StorySubmissionWizard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitContent } = useSubmissionOperations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<StorySubmissionFormData>();
  
  const onSubmit = async (data: StorySubmissionFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to share your story",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...data,
        type: "story",
        fileUrl: "", // For now, stories are text-based
        submittedBy: user.username || user.email
      };
      
      const success = await submitContent(user, submissionData);
      
      if (success) {
        setSubmitted(true);
        reset();
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle>Story Shared Successfully!</CardTitle>
          <CardDescription>
            Your story has been submitted and will be reviewed for publication in our cultural archive.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => setSubmitted(false)}>
            Share Another Story
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Share Your Story
        </CardTitle>
        <CardDescription>
          Share your story with our community and help preserve cultural narratives for future generations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Story Title *</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter your story title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Brief description of your story (2-3 sentences)"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="folklore">Folklore & Legends</SelectItem>
                  <SelectItem value="historical">Historical Stories</SelectItem>
                  <SelectItem value="personal">Personal Narratives</SelectItem>
                  <SelectItem value="traditional">Traditional Tales</SelectItem>
                  <SelectItem value="modern">Modern Stories</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cultural-origin">Cultural Origin</Label>
              <Input
                id="cultural-origin"
                {...register("culturalOrigin")}
                placeholder="e.g., West African, Irish, etc."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Your Story *</Label>
            <Textarea
              id="content"
              {...register("content", { required: "Story content is required" })}
              placeholder="Write your story here... Let your words come to life!"
              rows={10}
              className="resize-none"
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>
          
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="permission"
              className="mt-1"
              required
            />
            <div>
              <Label htmlFor="permission" className="text-sm font-normal">
                I confirm that I have the right to share this story and grant permission for it to be
                displayed in the archive with proper attribution.
              </Label>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Share Story
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
