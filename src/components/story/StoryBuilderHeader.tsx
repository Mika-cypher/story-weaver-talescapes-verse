
import { Button } from "@/components/ui/button";
import { Save, Eye, Play, Upload } from "lucide-react";

interface StoryBuilderHeaderProps {
  title: string;
  onSaveDraft: () => void;
  onPreview: () => void;
  onPublish: () => void;
  canPublish: boolean;
  isSaving?: boolean;
}

export const StoryBuilderHeader = ({
  title,
  onSaveDraft,
  onPreview,
  onPublish,
  canPublish,
  isSaving = false
}: StoryBuilderHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-card rounded-lg border">
      <div>
        <h1 className="text-2xl font-bold">{title || "Untitled Story"}</h1>
        <p className="text-muted-foreground">Create your interactive story</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onSaveDraft} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>
        <Button variant="outline" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button 
          onClick={onPublish} 
          disabled={!canPublish}
          className="bg-primary hover:bg-primary/90"
        >
          <Play className="h-4 w-4 mr-2" />
          Publish Story
        </Button>
      </div>
    </div>
  );
};
