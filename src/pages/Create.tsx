
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FileImage, FileAudio, Save, Eye, Upload } from "lucide-react";

const Create = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("write");

  const handleSaveDraft = () => {
    if (!title) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for your story.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Draft Saved",
      description: "Your story has been saved as a draft.",
    });
  };

  const handlePreview = () => {
    if (!title || !content) {
      toast({
        title: "Incomplete Story",
        description: "Please provide a title and content for your story.",
        variant: "destructive",
      });
      return;
    }

    setActiveTab("preview");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Create Your Story</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bring your imagination to life with text, visuals, and audio.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
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
                    placeholder="Write a brief description of your story..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="scifi">Science Fiction</SelectItem>
                      <SelectItem value="historical">Historical</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="horror">Horror</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="write" className="flex-1">Write</TabsTrigger>
                    <TabsTrigger value="visuals" className="flex-1">Visuals</TabsTrigger>
                    <TabsTrigger value="audio" className="flex-1">Audio</TabsTrigger>
                    <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="write" className="mt-4">
                    <Textarea
                      placeholder="Once upon a time..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[400px] resize-none"
                    />
                  </TabsContent>
                  
                  <TabsContent value="visuals" className="mt-4">
                    <div className="text-center p-8 border-2 border-dashed border-muted rounded-md">
                      <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-2">Add Visual Elements</h3>
                      <p className="text-muted-foreground mb-4">Upload images or illustrations to enhance your story</p>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="audio" className="mt-4">
                    <div className="text-center p-8 border-2 border-dashed border-muted rounded-md">
                      <FileAudio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-2">Add Audio Elements</h3>
                      <p className="text-muted-foreground mb-4">Upload narration, music, or sound effects for your story</p>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Audio
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-4">
                    {title && content ? (
                      <div className="bg-card rounded-lg p-6 shadow-inner">
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>
                        {excerpt && <p className="text-muted-foreground italic mb-6">{excerpt}</p>}
                        <div className="prose max-w-none">
                          {content.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-4">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Add a title and content to preview your story.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex flex-wrap justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="outline" onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button>Publish Story</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
