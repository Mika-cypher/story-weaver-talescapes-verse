
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Eye, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Story } from "@/types/story";

interface StoryFormProps {
  title: string;
  setTitle: (title: string) => void;
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
  category: string;
  setCategory: (category: string) => void;
  onSaveDraft: () => void;
  onPreview: () => void;
  onPublish: () => void;
}

export const StoryForm = ({
  title,
  setTitle,
  excerpt,
  setExcerpt,
  category,
  setCategory,
  onSaveDraft,
  onPreview,
  onPublish,
}: StoryFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Story Title</Label>
        <Input
          id="title"
          placeholder="Enter a compelling title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Short Description</Label>
        <Textarea
          id="excerpt"
          placeholder="Write a brief description of your story..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1 resize-none"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="mt-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fantasy">Fantasy</SelectItem>
            <SelectItem value="mystery">Mystery</SelectItem>
            <SelectItem value="scifi">Science Fiction</SelectItem>
            <SelectItem value="historical">Historical</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="romance">Romance</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onSaveDraft}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button variant="outline" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button onClick={onPublish}>
          <Play className="h-4 w-4 mr-2" />
          Publish Story
        </Button>
      </div>
    </div>
  );
};
