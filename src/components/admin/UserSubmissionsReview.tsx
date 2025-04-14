
import React, { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Eye, User, FileImage, FileAudio, BookText } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Submission {
  id: string;
  title: string;
  author: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  excerpt: string;
  type?: string;
  contentType?: string;
  previewUrl?: string;
}

// Mock data for user submissions with properly typed status values
const mockSubmissions: Submission[] = [
  {
    id: "sub-1",
    title: "The Lost City",
    author: "Jane Doe",
    date: "2023-05-15",
    status: "pending",
    excerpt: "A tale of adventure and discovery in the heart of the Amazon rainforest...",
    type: "story"
  },
  {
    id: "sub-2",
    title: "Echoes of Time",
    author: "John Smith",
    date: "2023-05-14",
    status: "pending",
    excerpt: "When the past and future collide, one woman must navigate the consequences...",
    type: "story"
  },
  {
    id: "sub-3",
    title: "Whispers in the Dark",
    author: "Alex Johnson",
    date: "2023-05-12",
    status: "pending",
    excerpt: "A mystery unfolds in a small town where nothing is as it seems...",
    type: "story"
  },
  {
    id: "sub-4",
    title: "Mountain Landscape",
    author: "Emily Chen",
    date: "2023-06-18",
    status: "pending",
    excerpt: "A stunning photograph of mountain ranges at sunset from my home region.",
    type: "image",
    previewUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  },
  {
    id: "sub-5",
    title: "Traditional Folk Song",
    author: "David Kim",
    date: "2023-06-20",
    status: "pending",
    excerpt: "A recording of a traditional folk song passed down through generations in my family.",
    type: "audio"
  },
  {
    id: "sub-6",
    title: "Cultural Festival Dance",
    author: "Maria Garcia",
    date: "2023-06-22",
    status: "pending",
    excerpt: "Video footage of a cultural dance performed at our local heritage festival.",
    type: "video"
  }
];

export const UserSubmissionsReview: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [tabValue, setTabValue] = useState("pending");
  const { toast } = useToast();

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleApproveSubmission = (id: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, status: "approved" } : sub
      )
    );
    toast({
      title: "Submission approved",
      description: "The user submission has been approved and published.",
    });
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(prev => prev ? { ...prev, status: "approved" } : null);
    }
  };

  const handleRejectSubmission = (id: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, status: "rejected" } : sub
      )
    );
    toast({
      title: "Submission rejected",
      description: "The user submission has been rejected.",
    });
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(prev => prev ? { ...prev, status: "rejected" } : null);
    }
  };

  const getSubmissionTypeIcon = (type?: string) => {
    switch (type) {
      case 'story':
        return <BookText className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <FileImage className="h-4 w-4 text-green-500" />;
      case 'audio':
        return <FileAudio className="h-4 w-4 text-purple-500" />;
      case 'video':
        return <FileAudio className="h-4 w-4 text-red-500" />;
      default:
        return <FileAudio className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredSubmissions = submissions.filter(sub => sub.status === tabValue);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Submissions</h2>
      
      <Tabs defaultValue="pending" onValueChange={setTabValue}>
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value={tabValue} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{getSubmissionTypeIcon(submission.type)}</TableCell>
                        <TableCell className="font-medium">{submission.title}</TableCell>
                        <TableCell>{submission.author}</TableCell>
                        <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewSubmission(submission)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {submission.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleApproveSubmission(submission.id)}
                                  title="Approve"
                                  className="text-green-600"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRejectSubmission(submission.id)}
                                  title="Reject"
                                  className="text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No {tabValue} submissions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="md:col-span-1">
              {selectedSubmission ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {getSubmissionTypeIcon(selectedSubmission.type)}
                          <span className="ml-2">{selectedSubmission.title}</span>
                        </CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <Avatar className="h-5 w-5 mr-2">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubmission.author}`} />
                            <AvatarFallback>{selectedSubmission.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          Submitted by {selectedSubmission.author} on {new Date(selectedSubmission.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedSubmission.previewUrl && selectedSubmission.type === 'image' && (
                      <div className="mb-4 rounded-md overflow-hidden">
                        <img 
                          src={selectedSubmission.previewUrl} 
                          alt={selectedSubmission.title}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    
                    <p className="text-sm">{selectedSubmission.excerpt}</p>
                    <div className="mt-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedSubmission.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : selectedSubmission.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {selectedSubmission.status === "pending" && (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => handleRejectSubmission(selectedSubmission.id)}
                          className="text-destructive"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleApproveSubmission(selectedSubmission.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <p>Select a submission to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
