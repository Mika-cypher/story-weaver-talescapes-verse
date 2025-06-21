
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Eye, Play } from "lucide-react";

interface StoryFormProps {
  title: string;
  setTitle: (title: string) => void;
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
  category: string;
  setCategory: (category: string) => void;
  content: string;
  setContent: (content: string) => void;
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
  content,
  setContent,
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
          placeholder="Write a brief description to hook your readers..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1 resize-none"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="category">Genre</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="mt-1">
            <SelectValue placeholder="Select a genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="folklore">African Folklore & Legends</SelectItem>
            <SelectItem value="historical">Historical Fiction</SelectItem>
            <SelectItem value="contemporary">Contemporary African Literature</SelectItem>
            <SelectItem value="romance">Romance</SelectItem>
            <SelectItem value="magical-realism">Magical Realism</SelectItem>
            <SelectItem value="urban-fiction">Urban Fiction</SelectItem>
            <SelectItem value="coming-of-age">Coming of Age</SelectItem>
            <SelectItem value="family-saga">Family Saga</SelectItem>
            <SelectItem value="political-fiction">Political Fiction</SelectItem>
            <SelectItem value="diaspora">Diaspora Stories</SelectItem>
            <SelectItem value="oral-tradition">Oral Tradition</SelectItem>
            <SelectItem value="postcolonial">Postcolonial Literature</SelectItem>
            <SelectItem value="afrofuturism">Afrofuturism</SelectItem>
            <SelectItem value="mystery">Mystery & Thriller</SelectItem>
            <SelectItem value="spiritual">Spiritual & Religious</SelectItem>
            <SelectItem value="lgbtq">LGBTQ+</SelectItem>
            <SelectItem value="young-adult">Young Adult</SelectItem>
            <SelectItem value="poetry">Poetry</SelectItem>
            <SelectItem value="memoir">Memoir & Biography</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="content">Your Story</Label>
        <Textarea
          id="content"
          placeholder="Begin your story here... Let your voice and heritage shine through your words!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 resize-none min-h-[400px]"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Share your unique African perspective and storytelling tradition. Your voice matters.
        </p>
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
