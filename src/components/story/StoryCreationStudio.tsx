
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  Image as ImageIcon,
  Mic,
  Video,
  Users,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Play,
  Pause,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StoryTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  culturalGuidelines: string[];
}

interface CreationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

const storyTemplates: StoryTemplate[] = [
  {
    id: 'folktale',
    title: 'Traditional Folktale',
    description: 'Share a story passed through generations in your culture',
    category: 'Cultural Heritage',
    difficulty: 'beginner',
    estimatedTime: '30-45 minutes',
    culturalGuidelines: [
      'Research the cultural origins thoroughly',
      'Include respectful cultural context',
      'Credit traditional sources when possible'
    ]
  },
  {
    id: 'personal-journey',
    title: 'Personal Cultural Journey',
    description: 'Tell your own story of cultural discovery or experience',
    category: 'Personal Narrative',
    difficulty: 'intermediate',
    estimatedTime: '45-60 minutes',
    culturalGuidelines: [
      'Share your authentic experience',
      'Be mindful of cultural sensitivity',
      'Respect privacy of others mentioned'
    ]
  },
  {
    id: 'interactive-myth',
    title: 'Interactive Mythology',
    description: 'Create a branching narrative based on cultural myths',
    category: 'Interactive Fiction',
    difficulty: 'advanced',
    estimatedTime: '2-3 hours',
    culturalGuidelines: [
      'Study multiple versions of the myth',
      'Maintain respectful interpretation',
      'Provide cultural context for choices'
    ]
  }
];

export const StoryCreationStudio: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    culturalContext: '',
    media: {
      images: [] as File[],
      audio: [] as File[],
      video: [] as File[]
    }
  });

  const creationSteps: CreationStep[] = [
    {
      id: 'template',
      title: 'Choose Template',
      description: 'Select a template that matches your story type',
      completed: !!selectedTemplate,
      required: true
    },
    {
      id: 'basics',
      title: 'Story Basics',
      description: 'Title, description, and category',
      completed: !!(storyData.title && storyData.description),
      required: true
    },
    {
      id: 'content',
      title: 'Write Content',
      description: 'Craft your narrative',
      completed: !!storyData.content,
      required: true
    },
    {
      id: 'context',
      title: 'Cultural Context',
      description: 'Provide background and significance',
      completed: !!storyData.culturalContext,
      required: false
    },
    {
      id: 'media',
      title: 'Add Media',
      description: 'Upload images, audio, or video',
      completed: Object.values(storyData.media).some(arr => arr.length > 0),
      required: false
    },
    {
      id: 'review',
      title: 'Review & Publish',
      description: 'Final review before publishing',
      completed: false,
      required: true
    }
  ];

  const progress = (creationSteps.filter(step => step.completed).length / creationSteps.length) * 100;

  const handleTemplateSelect = (template: StoryTemplate) => {
    setSelectedTemplate(template);
    setStoryData(prev => ({ ...prev, category: template.category }));
    setCurrentStep(1);
  };

  const handleFileUpload = (type: 'images' | 'audio' | 'video', files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setStoryData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        [type]: [...prev.media[type], ...newFiles]
      }
    }));
    
    toast({
      title: "Media uploaded",
      description: `${newFiles.length} file(s) added to your story`
    });
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement audio recording logic
    toast({
      title: "Recording started",
      description: "Speak clearly into your microphone"
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Audio has been saved to your story"
    });
  };

  const nextStep = () => {
    if (currentStep < creationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Story Creation Studio</h1>
          <p className="text-muted-foreground mb-4">
            Craft compelling narratives with our guided creation tools
          </p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
          <div className="flex items-center space-x-2">
            {creationSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    index === currentStep
                      ? 'bg-heritage-purple text-white'
                      : step.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-current" />
                  )}
                  <span className="text-sm font-medium">{step.title}</span>
                </button>
                {index < creationSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Template Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose Your Story Template</h2>
                  <p className="text-muted-foreground">
                    Select a template to get started with guided prompts and best practices
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storyTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate?.id === template.id ? 'ring-2 ring-heritage-purple' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{template.category}</Badge>
                          <Badge
                            variant={
                              template.difficulty === 'beginner'
                                ? 'default'
                                : template.difficulty === 'intermediate'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {template.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {template.description}
                        </p>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center text-muted-foreground">
                            <span>Estimated time: {template.estimatedTime}</span>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Cultural Guidelines:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {template.culturalGuidelines.slice(0, 2).map((guideline, index) => (
                                <li key={index}>{guideline}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Story Basics */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Story Basics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Story Title</label>
                    <Input
                      value={storyData.title}
                      onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter your story title..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={storyData.description}
                      onChange={(e) => setStoryData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Provide a brief description of your story..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Input
                      value={storyData.category}
                      onChange={(e) => setStoryData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Story category..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Creation */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Write Your Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={storyData.content}
                    onChange={(e) => setStoryData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Begin writing your story here..."
                    rows={12}
                    className="min-h-[300px]"
                  />
                  
                  {selectedTemplate && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Writing Tips for {selectedTemplate.title}
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {selectedTemplate.culturalGuidelines.map((tip, index) => (
                          <li key={index}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cultural Context */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Cultural Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={storyData.culturalContext}
                    onChange={(e) => setStoryData(prev => ({ ...prev, culturalContext: e.target.value }))}
                    placeholder="Provide cultural background, historical context, or significance of your story..."
                    rows={8}
                  />
                </CardContent>
              </Card>
            )}

            {/* Media Upload */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Tabs defaultValue="images">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="images">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Images
                    </TabsTrigger>
                    <TabsTrigger value="audio">
                      <Mic className="h-4 w-4 mr-2" />
                      Audio
                    </TabsTrigger>
                    <TabsTrigger value="video">
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="images">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add Images</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload images to enhance your story
                          </p>
                          <Button onClick={() => fileInputRef.current?.click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Images
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload('images', e.target.files)}
                          />
                        </div>
                        
                        {storyData.media.images.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">
                              Uploaded Images ({storyData.media.images.length})
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                              {storyData.media.images.map((file, index) => (
                                <div key={index} className="aspect-square bg-muted rounded border text-xs p-2 overflow-hidden">
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="audio">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add Audio</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            variant={isRecording ? "destructive" : "default"}
                            onClick={isRecording ? stopRecording : startRecording}
                          >
                            {isRecording ? (
                              <>
                                <Square className="h-4 w-4 mr-2" />
                                Stop Recording
                              </>
                            ) : (
                              <>
                                <Mic className="h-4 w-4 mr-2" />
                                Start Recording
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <div className="text-center text-sm text-muted-foreground">
                          Or upload audio files
                        </div>
                        
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                          <Button onClick={() => fileInputRef.current?.click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Audio Files
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload('audio', e.target.files)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="video">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add Video</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                          <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload video content for your story
                          </p>
                          <Button onClick={() => fileInputRef.current?.click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Videos
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload('video', e.target.files)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Review */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Story Summary</h4>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p><strong>Title:</strong> {storyData.title}</p>
                      <p><strong>Category:</strong> {storyData.category}</p>
                      <p><strong>Description:</strong> {storyData.description}</p>
                      <p><strong>Content Length:</strong> {storyData.content.split(' ').length} words</p>
                      <p><strong>Media:</strong> {Object.values(storyData.media).flat().length} files</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button variant="outline" className="flex-1">
                      Save as Draft
                    </Button>
                    <Button className="flex-1">
                      Publish Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === creationSteps.length - 1}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
