import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleDot, Flag, Play } from "lucide-react";
import { motion } from "framer-motion";
import { StoryScene } from "@/types/story";

interface StoryFlowVisualizerProps {
  scenes: StoryScene[];
  startSceneId?: string;
  onSceneClick: (sceneId: string) => void;
  currentEditingScene?: string;
}

export const StoryFlowVisualizer: React.FC<StoryFlowVisualizerProps> = ({
  scenes,
  startSceneId,
  onSceneClick,
  currentEditingScene
}) => {
  const getSceneConnections = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    return scene ? scene.choices.map(choice => choice.nextSceneId) : [];
  };

  const getIncomingConnections = (sceneId: string) => {
    return scenes.filter(scene => 
      scene.choices.some(choice => choice.nextSceneId === sceneId)
    ).map(scene => scene.id);
  };

  const isOrphanScene = (sceneId: string) => {
    return sceneId !== startSceneId && getIncomingConnections(sceneId).length === 0;
  };

  const renderScene = (scene: StoryScene, level: number = 0, visited: Set<string> = new Set()) => {
    if (visited.has(scene.id)) {
      return null; // Prevent infinite loops
    }

    visited.add(scene.id);
    const connections = getSceneConnections(scene.id);
    const isStart = scene.id === startSceneId;
    const isEnd = scene.isEnding;
    const isEditing = scene.id === currentEditingScene;
    const isOrphan = isOrphanScene(scene.id);

    return (
      <motion.div
        key={scene.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1 }}
        className="relative"
      >
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            isEditing ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
          } ${isOrphan ? 'border-orange-300 bg-orange-50/50' : ''}`}
          onClick={() => onSceneClick(scene.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center">
                {isStart && <Play className="mr-2 h-4 w-4 text-green-600" />}
                {isEnd && <Flag className="mr-2 h-4 w-4 text-red-600" />}
                {!isStart && !isEnd && <CircleDot className="mr-2 h-4 w-4 text-blue-600" />}
                <span className="truncate">{scene.title}</span>
              </CardTitle>
              <div className="flex space-x-1">
                {isStart && <Badge variant="secondary" className="text-xs">Start</Badge>}
                {isEnd && <Badge variant="destructive" className="text-xs">End</Badge>}
                {isOrphan && <Badge variant="outline" className="text-xs text-orange-600">Orphan</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {scene.content.substring(0, 100)}...
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {scene.choices.length} choice{scene.choices.length !== 1 ? 's' : ''}
              </span>
              {connections.length > 0 && (
                <div className="flex items-center text-blue-600">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  <span>{connections.length} connection{connections.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const organizeScenesByLevel = () => {
    const levels: StoryScene[][] = [];
    const visited = new Set<string>();
    const queue = startSceneId ? [{ scene: scenes.find(s => s.id === startSceneId)!, level: 0 }] : [];

    while (queue.length > 0) {
      const { scene, level } = queue.shift()!;
      
      if (visited.has(scene.id)) continue;
      visited.add(scene.id);

      if (!levels[level]) levels[level] = [];
      levels[level].push(scene);

      const connections = getSceneConnections(scene.id);
      connections.forEach(nextSceneId => {
        const nextScene = scenes.find(s => s.id === nextSceneId);
        if (nextScene && !visited.has(nextScene.id)) {
          queue.push({ scene: nextScene, level: level + 1 });
        }
      });
    }

    // Add orphan scenes to a separate level
    const orphanScenes = scenes.filter(scene => 
      !visited.has(scene.id) && isOrphanScene(scene.id)
    );
    if (orphanScenes.length > 0) {
      levels.push(orphanScenes);
    }

    return levels;
  };

  const levels = organizeScenesByLevel();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CircleDot className="mr-2 h-5 w-5" />
          Story Flow
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Visual representation of your story's narrative flow and connections
        </p>
      </CardHeader>
      <CardContent>
        {scenes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CircleDot className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No scenes created yet</p>
            <p className="text-xs">Start by creating your first scene</p>
          </div>
        ) : (
          <div className="space-y-6">
            {levels.map((levelScenes, levelIndex) => (
              <div key={levelIndex} className="space-y-3">
                {levelIndex > 0 && (
                  <div className="flex justify-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {levelScenes.map(scene => renderScene(scene, levelIndex))}
                </div>
              </div>
            ))}
            
            {/* Flow Statistics */}
            <div className="border-t pt-4 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{scenes.length}</div>
                  <div className="text-xs text-muted-foreground">Total Scenes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {scenes.filter(s => s.id === startSceneId).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Start Scenes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {scenes.filter(s => s.isEnding).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Endings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {scenes.filter(s => isOrphanScene(s.id)).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Orphan Scenes</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};