
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Eye, Play, Settings, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              {title || "Untitled Story"}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="hover:bg-accent"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={onSaveDraft} size="sm">
              <Save className="h-4 w-4 mr-1" />
              Draft
            </Button>
            <Button variant="ghost" onClick={onPreview} size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button onClick={onPublish} size="sm">
              <Play className="h-4 w-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-16 z-40 w-80 h-full bg-background border-l border-border p-6 shadow-lg"
        >
          <h3 className="font-semibold mb-4">Story Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Genre
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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
          </div>
        </motion.div>
      )}

      {/* Main Editor */}
      <div className={`transition-all duration-300 ${showSettings ? 'mr-80' : ''}`}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Title Input */}
          <div className="mb-8">
            <Input
              placeholder="Story title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-bold border-none shadow-none p-0 h-auto placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              style={{
                fontSize: '2.25rem',
                lineHeight: '2.5rem',
                fontWeight: '700'
              }}
            />
          </div>

          {/* Subtitle/Excerpt Input */}
          <div className="mb-12">
            <Textarea
              placeholder="Add a subtitle or brief description..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="text-xl text-muted-foreground border-none shadow-none p-0 resize-none placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              rows={2}
              style={{
                fontSize: '1.25rem',
                lineHeight: '1.75rem'
              }}
            />
          </div>

          {/* Content Editor */}
          <div className="min-h-[60vh]">
            <Textarea
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-lg leading-relaxed border-none shadow-none p-0 resize-none placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent min-h-[60vh]"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75rem'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
