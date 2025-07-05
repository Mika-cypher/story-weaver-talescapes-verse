import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowRight, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  condition?: string;
  consequence?: string;
}

interface EnhancedChoiceEditorProps {
  choices: Choice[];
  availableScenes: Array<{ id: string; title: string }>;
  onChoicesChange: (choices: Choice[]) => void;
}

export const EnhancedChoiceEditor: React.FC<EnhancedChoiceEditorProps> = ({
  choices,
  availableScenes,
  onChoicesChange
}) => {
  const [editingChoice, setEditingChoice] = useState<string | null>(null);

  const addChoice = () => {
    const newChoice: Choice = {
      id: `choice-${Date.now()}`,
      text: "New choice",
      nextSceneId: "",
    };
    onChoicesChange([...choices, newChoice]);
    setEditingChoice(newChoice.id);
  };

  const updateChoice = (id: string, updates: Partial<Choice>) => {
    const updatedChoices = choices.map(choice =>
      choice.id === id ? { ...choice, ...updates } : choice
    );
    onChoicesChange(updatedChoices);
  };

  const deleteChoice = (id: string) => {
    onChoicesChange(choices.filter(choice => choice.id !== id));
    if (editingChoice === id) {
      setEditingChoice(null);
    }
  };

  const getSceneTitle = (sceneId: string) => {
    const scene = availableScenes.find(s => s.id === sceneId);
    return scene ? scene.title : "Unknown Scene";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Story Choices</h3>
        <Button onClick={addChoice} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Choice
        </Button>
      </div>

      <AnimatePresence>
        {choices.map((choice, index) => (
          <motion.div
            key={choice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs mr-2">
                      {index + 1}
                    </span>
                    Choice
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingChoice(
                        editingChoice === choice.id ? null : choice.id
                      )}
                      className="h-8 w-8"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteChoice(choice.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {editingChoice === choice.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Choice Text
                      </label>
                      <Textarea
                        value={choice.text}
                        onChange={(e) => updateChoice(choice.id, { text: e.target.value })}
                        placeholder="What choice do readers have?"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Next Scene
                      </label>
                      <select
                        value={choice.nextSceneId}
                        onChange={(e) => updateChoice(choice.id, { nextSceneId: e.target.value })}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="">Select next scene...</option>
                        {availableScenes.map(scene => (
                          <option key={scene.id} value={scene.id}>
                            {scene.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Condition (Optional)
                      </label>
                      <Input
                        value={choice.condition || ""}
                        onChange={(e) => updateChoice(choice.id, { condition: e.target.value })}
                        placeholder="e.g., if user has item X"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Consequence (Optional)
                      </label>
                      <Input
                        value={choice.consequence || ""}
                        onChange={(e) => updateChoice(choice.id, { consequence: e.target.value })}
                        placeholder="e.g., gain courage points"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm">{choice.text}</p>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <ArrowRight className="h-4 w-4" />
                      <span>
                        {choice.nextSceneId ? getSceneTitle(choice.nextSceneId) : "No scene selected"}
                      </span>
                    </div>

                    {(choice.condition || choice.consequence) && (
                      <div className="flex flex-wrap gap-2">
                        {choice.condition && (
                          <Badge variant="outline" className="text-xs">
                            Condition: {choice.condition}
                          </Badge>
                        )}
                        {choice.consequence && (
                          <Badge variant="secondary" className="text-xs">
                            Effect: {choice.consequence}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {choices.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No choices added yet</p>
            <Button onClick={addChoice} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create First Choice
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};