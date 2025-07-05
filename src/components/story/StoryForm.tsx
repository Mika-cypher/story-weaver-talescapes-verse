
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Eye, Play, Settings, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RichTextEditor } from "./RichTextEditor";
import AudioNarrationRecorder from "./AudioNarrationRecorder";
import ReadingModeSelector from "./ReadingModeSelector";
import CollaborationRequestButton from "./CollaborationRequestButton";

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
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [readingMode, setReadingMode] = useState<'text' | 'audio' | 'both'>('text');
  const navigate = useNavigate();

  const handleAudioReady = (blob: Blob, url: string) => {
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const hasAudio = audioBlob && audioBlob.size > 0;

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
              {title || "Untitled Creation"}
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
          className="fixed right-0 top-16 z-40 w-80 h-full bg-background border-l border-border p-6 shadow-lg overflow-y-auto"
        >
          <div className="space-y-4">
            <h3 className="font-semibold mb-4">Advanced Settings</h3>
            
            <CollaborationRequestButton
              storyId="temp-id"
              storyTitle={title}
              isPublished={false}
            />
          </div>
        </motion.div>
      )}

      {/* Main Editor */}
      <div className={`transition-all duration-300 ${showSettings ? 'mr-80' : ''}`}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Title Input */}
          <div className="mb-8">
            <Input
              placeholder="Title of your creation"
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
          <div className="mb-8">
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

          {/* Category Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-muted-foreground min-w-[80px]">
                Category:
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="poetry">Poetry</SelectItem>
                  <SelectItem value="folklore">Folklore & Legends</SelectItem>
                  <SelectItem value="historical">Historical</SelectItem>
                  <SelectItem value="contemporary">Contemporary</SelectItem>
                  <SelectItem value="audio-story">Audio Story</SelectItem>
                  <SelectItem value="mixed-media">Mixed Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audio Narration Section */}
          <div className="mb-8">
            <AudioNarrationRecorder
              onAudioReady={handleAudioReady}
              existingAudioUrl={audioUrl}
            />
          </div>

          {/* Reading Mode Selection */}
          <div className="mb-8">
            <ReadingModeSelector
              selectedMode={readingMode}
              onModeChange={setReadingMode}
              hasAudio={hasAudio}
            />
          </div>

          {/* Rich Text Content Editor */}
          <div className="min-h-[60vh]">
            <RichTextEditor
              content={content}
              setContent={setContent}
              placeholder="Start creating... Use the toolbar above to add text, images, videos, audio, and more!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
