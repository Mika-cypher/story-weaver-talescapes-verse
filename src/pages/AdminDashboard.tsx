
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import { BookText, Star, FilePenLine, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { UserSubmissionsReview } from "@/components/admin/UserSubmissionsReview";
import { CategoriesAndVisualsManagement } from "@/components/admin/CategoriesAndVisualsManagement";

const AdminDashboard: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the tab from URL query params
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam || 'overview');

  useEffect(() => {
    // Update the active tab when the URL changes
    setActiveTab(tabParam || 'overview');
  }, [tabParam]);

  useEffect(() => {
    const loadStories = () => {
      const allStories = storyService.getStories();
      setStories(allStories);
    };

    loadStories();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/dashboard${value !== 'overview' ? `?tab=${value}` : ''}`);
  };

  const publishedCount = stories.filter(story => story.status === "published").length;
  const draftCount = stories.filter(story => story.status === "draft").length;
  const featuredCount = stories.filter(story => story.featured).length;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your interactive stories</p>
        </div>
        <Button onClick={() => navigate("/admin/stories/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Story
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="submissions">User Submissions</TabsTrigger>
          <TabsTrigger value="categories">Categories & Visuals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
                <BookText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stories.length}</div>
                <p className="text-xs text-muted-foreground">
                  All your interactive stories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <FilePenLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedCount}</div>
                <p className="text-xs text-muted-foreground">
                  {draftCount} in draft mode
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{featuredCount}</div>
                <p className="text-xs text-muted-foreground">
                  Stories highlighted on homepage
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stories</CardTitle>
                <CardDescription>
                  Your most recently updated stories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stories.length > 0 ? (
                  <div className="space-y-4">
                    {stories
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .slice(0, 5)
                      .map(story => (
                        <div key={story.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h3 className="font-medium">{story.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Last updated: {new Date(story.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {story.featured && <Star className="h-4 w-4 text-yellow-500" />}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              story.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {story.status}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/stories/${story.id}/edit`)}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No stories yet. Create your first story!</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate("/admin/stories/new")}
                    >
                      Create New Story
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <ContentManagement />
        </TabsContent>

        <TabsContent value="submissions">
          <UserSubmissionsReview />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesAndVisualsManagement />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
