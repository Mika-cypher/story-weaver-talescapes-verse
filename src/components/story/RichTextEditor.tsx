
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link, 
  Image, 
  Video, 
  AudioLines,
  Type,
  Palette
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  setContent: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ content, setContent, placeholder }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showAudioDialog, setShowAudioDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const insertTextAtCursor = (textToInsert: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const newText = text.substring(0, start) + textToInsert + text.substring(end);
    setContent(newText);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const wrapSelectedText = (prefix: string, suffix: string = prefix) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      const wrappedText = prefix + selectedText + suffix;
      insertTextAtCursor(wrappedText);
    } else {
      insertTextAtCursor(prefix + suffix);
    }
  };

  const handleFormatClick = (format: string) => {
    switch (format) {
      case 'bold':
        wrapSelectedText('**');
        break;
      case 'italic':
        wrapSelectedText('*');
        break;
      case 'underline':
        wrapSelectedText('<u>', '</u>');
        break;
      case 'strikethrough':
        wrapSelectedText('~~');
        break;
      case 'heading1':
        insertTextAtCursor('\n# ');
        break;
      case 'heading2':
        insertTextAtCursor('\n## ');
        break;
      case 'heading3':
        insertTextAtCursor('\n### ');
        break;
    }
  };

  const insertLink = () => {
    if (linkText && linkUrl) {
      insertTextAtCursor(`[${linkText}](${linkUrl})`);
      setLinkText('');
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const insertImage = () => {
    if (imageUrl) {
      insertTextAtCursor(`![${imageAlt || 'Image'}](${imageUrl})`);
      setImageUrl('');
      setImageAlt('');
      setShowImageDialog(false);
    }
  };

  const insertVideo = () => {
    if (videoUrl) {
      insertTextAtCursor(`\n<video controls width="100%">\n  <source src="${videoUrl}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n`);
      setVideoUrl('');
      setShowVideoDialog(false);
    }
  };

  const insertAudio = () => {
    if (audioUrl) {
      insertTextAtCursor(`\n<audio controls>\n  <source src="${audioUrl}" type="audio/mp3">\n  Your browser does not support the audio element.\n</audio>\n`);
      setAudioUrl('');
      setShowAudioDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md border">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatClick('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatClick('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatClick('underline')}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatClick('strikethrough')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border" />

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatClick('heading1')}
            title="Heading 1"
            className="font-bold"
          >
            H1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatClick('heading2')}
            title="Heading 2"
            className="font-semibold"
          >
            H2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormatClick('heading3')}
            title="Heading 3"
          >
            H3
          </Button>
        </div>

        <div className="w-px h-6 bg-border" />

        <div className="flex gap-1">
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" title="Insert Link">
                <Link className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-text">Link Text</Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Enter link text"
                  />
                </div>
                <div>
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <Button onClick={insertLink} className="w-full">
                  Insert Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" title="Insert Image">
                <Image className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="image-alt">Alt Text (optional)</Label>
                  <Input
                    id="image-alt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Describe the image"
                  />
                </div>
                <Button onClick={insertImage} className="w-full">
                  Insert Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" title="Insert Video">
                <Video className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-url">Video URL</Label>
                  <Input
                    id="video-url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                <Button onClick={insertVideo} className="w-full">
                  Insert Video
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAudioDialog} onOpenChange={setShowAudioDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" title="Insert Audio">
                <AudioLines className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Audio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audio-url">Audio URL</Label>
                  <Input
                    id="audio-url"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://example.com/audio.mp3"
                  />
                </div>
                <Button onClick={insertAudio} className="w-full">
                  Insert Audio
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        placeholder={placeholder || "Tell your story..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[60vh] text-lg leading-relaxed resize-none"
        style={{
          fontSize: '1.125rem',
          lineHeight: '1.75rem'
        }}
      />

      {/* Format Guide */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Formatting Guide:</strong></p>
        <p>**Bold** | *Italic* | <u>&lt;u&gt;Underline&lt;/u&gt;</u> | ~~Strikethrough~~ | # Heading 1 | ## Heading 2 | ### Heading 3</p>
        <p>[Link Text](URL) | ![Alt Text](Image URL) | Use toolbar buttons for media insertion</p>
      </div>
    </div>
  );
};
