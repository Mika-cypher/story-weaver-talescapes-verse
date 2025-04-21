
import { Button } from "@/components/ui/button";
import { Plus, GitBranch } from "lucide-react";

interface StoryStructureFooterProps {
  addScene: () => void;
  addChoice: () => void;
  currentSceneId: string | null;
}

export const StoryStructureFooter = ({
  addScene,
  addChoice,
  currentSceneId,
}: StoryStructureFooterProps) => (
  <div className="lg:col-span-4 flex items-center justify-between">
    <h3 className="text-lg font-medium">Story Structure</h3>
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={addScene}>
        <Plus className="h-4 w-4 mr-2" />
        Add Scene
      </Button>
      <Button variant="outline" size="sm" onClick={addChoice} disabled={!currentSceneId}>
        <GitBranch className="h-4 w-4 mr-2" />
        Add Choice
      </Button>
    </div>
  </div>
);

