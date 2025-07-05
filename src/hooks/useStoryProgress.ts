import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { storyProgressService, ParsedStoryProgress, StoryChoice } from "@/services/storyProgressService";

export const useStoryProgress = (storyId: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ParsedStoryProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id || !storyId) {
        setLoading(false);
        return;
      }

      const userProgress = await storyProgressService.getProgress(user.id, storyId);
      setProgress(userProgress);
      setLoading(false);
    };

    loadProgress();
  }, [user?.id, storyId]);

  const updateProgress = async (updates: {
    current_scene_id?: string;
    scenes_visited?: string[];
    choices_made?: StoryChoice[];
    completion_percentage?: number;
  }) => {
    if (!user?.id || !storyId) return;

    const updatedProgress = await storyProgressService.updateProgress(
      user.id,
      storyId,
      updates
    );

    if (updatedProgress) {
      setProgress(updatedProgress);
    }
  };

  const addChoice = async (choice: StoryChoice) => {
    if (!progress) return;

    const newChoices = [...progress.choices_made, choice];
    await updateProgress({ choices_made: newChoices });
  };

  const visitScene = async (sceneId: string) => {
    if (!progress) return;

    const newScenesVisited = progress.scenes_visited.includes(sceneId)
      ? progress.scenes_visited
      : [...progress.scenes_visited, sceneId];

    await updateProgress({
      current_scene_id: sceneId,
      scenes_visited: newScenesVisited
    });
  };

  const calculateProgress = (totalScenes: number): number => {
    if (!progress || totalScenes === 0) return 0;
    return Math.round((progress.scenes_visited.length / totalScenes) * 100);
  };

  return {
    progress,
    loading,
    updateProgress,
    addChoice,
    visitScene,
    calculateProgress
  };
};