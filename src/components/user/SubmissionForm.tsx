
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Upload } from "lucide-react";

interface SubmissionFormValues {
  title: string;
  description: string;
  contentType: string;
  culturalOrigin: string;
  releasePermission: boolean;
}

export const SubmissionForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SubmissionFormValues>();
  
  const onSubmit = (data: SubmissionFormValues) => {
    if (!uploadedFile) {
      toast({
        title: "Missing file",
        description: "Please upload a file for your submission",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Submission received!",
        description: "Your content has been submitted for review and will be published once approved.",
      });
      
      setIsSubmitting(false);
      setUploadedFile(null);
      reset();
    }, 1500);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit to Cultural Heritage Archive</CardTitle>
        <CardDescription>
          Share cultural stories, songs, art, or artifacts to help preserve cultural heritage.
          All submissions will be reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Give your submission a name"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Describe the cultural significance of your submission"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select>
                <SelectTrigger id="content-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="story">Story or Legend</SelectItem>
                  <SelectItem value="song">Song or Music</SelectItem>
                  <SelectItem value="art">Art or Craft</SelectItem>
                  <SelectItem value="recipe">Recipe or Culinary Tradition</SelectItem>
                  <SelectItem value="artifact">Artifact or Historical Item</SelectItem>
                  <SelectItem value="dance">Dance or Performance</SelectItem>
                  <SelectItem value="other">Other Cultural Element</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cultural-origin">Cultural Origin</Label>
              <Input
                id="cultural-origin"
                {...register("culturalOrigin", { required: "Cultural origin is required" })}
                placeholder="Region, community, or group"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Upload File</Label>
            <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
              {uploadedFile ? (
                <div className="space-y-2">
                  <FileUp className="h-10 w-10 text-primary mx-auto" />
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setUploadedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">Drag and drop or click to upload</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Support for images, audio, video, and document files
                    </p>
                  </div>
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" className="cursor-pointer">
                      Select File
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileUpload}
                      accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="permission"
              className="mt-1"
              {...register("releasePermission", { required: "Permission is required" })}
            />
            <div>
              <Label htmlFor="permission" className="text-sm font-normal">
                I confirm that I have the right to share this content and grant permission for it to be
                displayed in the Cultural Heritage Archive with proper attribution.
              </Label>
              {errors.releasePermission && (
                <p className="text-sm text-destructive">{errors.releasePermission.message}</p>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
