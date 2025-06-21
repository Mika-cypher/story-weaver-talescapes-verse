
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Music, 
  Video, 
  FileText,
  Eye,
  Share2
} from "lucide-react";
import { mediaService, Portfolio, PortfolioItem, CreatorMedia } from "@/services/mediaService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PortfolioManager: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [userMedia, setUserMedia] = useState<CreatorMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover_image_url: "",
    portfolio_type: "general",
    is_public: true
  });

  useEffect(() => {
    if (user) {
      loadPortfolios();
      loadUserMedia();
    }
  }, [user]);

  const loadPortfolios = async () => {
    if (!user) return;
    
    try {
      const userPortfolios = await mediaService.getUserPortfolios(user.id);
      setPortfolios(userPortfolios);
    } catch (error) {
      console.error("Failed to load portfolios:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserMedia = async () => {
    if (!user) return;
    
    try {
      const media = await mediaService.getUserMedia(user.id);
      setUserMedia(media);
    } catch (error) {
      console.error("Failed to load user media:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingPortfolio) {
        // Update existing portfolio
        await mediaService.updatePortfolio(editingPortfolio.id, {
          ...formData,
          user_id: user.id
        });
        toast({
          title: "Portfolio updated",
          description: "Your portfolio has been updated successfully"
        });
      } else {
        // Create new portfolio
        await mediaService.createPortfolio({
          ...formData,
          user_id: user.id
        });
        toast({
          title: "Portfolio created",
          description: "Your new portfolio has been created successfully"
        });
      }
      
      setShowCreateDialog(false);
      setEditingPortfolio(null);
      resetForm();
      loadPortfolios();
    } catch (error) {
      console.error("Failed to save portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to save portfolio",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      cover_image_url: "",
      portfolio_type: "general",
      is_public: true
    });
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      description: portfolio.description || "",
      cover_image_url: portfolio.cover_image_url || "",
      portfolio_type: portfolio.portfolio_type,
      is_public: portfolio.is_public
    });
    setShowCreateDialog(true);
  };

  const handleDelete = async (portfolioId: string) => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      await mediaService.deletePortfolio(portfolioId);
      toast({
        title: "Portfolio deleted",
        description: "Portfolio has been deleted successfully"
      });
      loadPortfolios();
    } catch (error) {
      console.error("Failed to delete portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio",
        variant: "destructive"
      });
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Portfolios</h2>
          <p className="text-muted-foreground">Organize your work into curated collections</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPortfolio(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPortfolio ? "Edit Portfolio" : "Create New Portfolio"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Portfolio title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your portfolio"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input
                  id="cover_image"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({...formData, cover_image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="portfolio_type">Type</Label>
                <Select 
                  value={formData.portfolio_type} 
                  onValueChange={(value) => setFormData({...formData, portfolio_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="artwork">Artwork</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                />
                <Label htmlFor="is_public">Make this portfolio public</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPortfolio ? "Update" : "Create"} Portfolio
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {portfolios.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">You haven't created any portfolios yet.</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Portfolio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {portfolio.portfolio_type}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {portfolio.is_public ? (
                      <Badge variant="default" className="text-xs">Public</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Private</Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-1">{portfolio.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2">
                {portfolio.cover_image_url ? (
                  <img
                    src={portfolio.cover_image_url}
                    alt={portfolio.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-32 bg-muted rounded mb-3 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {portfolio.description || "No description"}
                </p>
                
                {portfolio.items && portfolio.items.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                      {portfolio.items.length} item{portfolio.items.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex space-x-1">
                      {portfolio.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="p-1 bg-muted rounded">
                          {getMediaIcon(item.media?.media_type || 'document')}
                        </div>
                      ))}
                      {portfolio.items.length > 3 && (
                        <div className="p-1 bg-muted rounded">
                          <span className="text-xs">+{portfolio.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(portfolio)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(portfolio.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
