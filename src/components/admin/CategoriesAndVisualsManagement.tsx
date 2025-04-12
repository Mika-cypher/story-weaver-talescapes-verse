
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Settings, Tag, Image as ImageIcon, Edit, Trash2, GalleryHorizontal } from "lucide-react";
import { categories } from "@/data/mockStories";

interface Category {
  id: string;
  name: string;
  storyCount: number;
}

interface VisualAsset {
  id: string;
  name: string;
  url: string;
  type: "background" | "image";
  category: string;
}

export const CategoriesAndVisualsManagement: React.FC = () => {
  // Initialize with mock data based on the imported categories
  const initialCategories: Category[] = categories.filter(c => c !== "All").map((name, index) => ({
    id: `cat-${index + 1}`,
    name,
    storyCount: Math.floor(Math.random() * 10)
  }));

  const [storyCategories, setStoryCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Mock visual assets
  const [visualAssets, setVisualAssets] = useState<VisualAsset[]>([
    {
      id: "vis-1",
      name: "Forest Background",
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b",
      type: "background",
      category: "Nature"
    },
    {
      id: "vis-2",
      name: "Space Nebula",
      url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
      type: "background",
      category: "Sci-Fi"
    },
    {
      id: "vis-3",
      name: "Character Portrait",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      type: "image",
      category: "Characters"
    }
  ]);
  
  const [newVisualName, setNewVisualName] = useState("");
  const [newVisualUrl, setNewVisualUrl] = useState("");
  const [newVisualType, setNewVisualType] = useState<"background" | "image">("image");
  const [newVisualCategory, setNewVisualCategory] = useState("");
  const [editingVisual, setEditingVisual] = useState<VisualAsset | null>(null);

  const { toast } = useToast();

  // Category functions
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (storyCategories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      storyCount: 0
    };

    setStoryCategories([...storyCategories, newCategory]);
    setNewCategoryName("");
    
    toast({
      title: "Category added",
      description: `"${newCategoryName}" has been added to the categories.`
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    
    if (!editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (storyCategories.some(cat => 
      cat.id !== editingCategory.id && 
      cat.name.toLowerCase() === editingCategory.name.toLowerCase()
    )) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive"
      });
      return;
    }

    setStoryCategories(prev => 
      prev.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      )
    );
    
    setEditingCategory(null);
    
    toast({
      title: "Category updated",
      description: `The category has been updated to "${editingCategory.name}".`
    });
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = storyCategories.find(cat => cat.id === id);
    
    if (categoryToDelete && categoryToDelete.storyCount > 0) {
      toast({
        title: "Cannot delete",
        description: `This category is used by ${categoryToDelete.storyCount} stories.`,
        variant: "destructive"
      });
      return;
    }
    
    setStoryCategories(prev => prev.filter(cat => cat.id !== id));
    
    toast({
      title: "Category deleted",
      description: "The category has been deleted."
    });
  };

  // Visual asset functions
  const handleAddVisual = () => {
    if (!newVisualName.trim() || !newVisualUrl.trim() || !newVisualCategory.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    const newVisual: VisualAsset = {
      id: `vis-${Date.now()}`,
      name: newVisualName,
      url: newVisualUrl,
      type: newVisualType,
      category: newVisualCategory
    };

    setVisualAssets([...visualAssets, newVisual]);
    setNewVisualName("");
    setNewVisualUrl("");
    setNewVisualType("image");
    setNewVisualCategory("");
    
    toast({
      title: "Visual asset added",
      description: `"${newVisualName}" has been added to the visual assets.`
    });
  };

  const handleUpdateVisual = () => {
    if (!editingVisual) return;
    
    if (!editingVisual.name.trim() || !editingVisual.url.trim() || !editingVisual.category.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    setVisualAssets(prev => 
      prev.map(vis => 
        vis.id === editingVisual.id ? editingVisual : vis
      )
    );
    
    setEditingVisual(null);
    
    toast({
      title: "Visual asset updated",
      description: `"${editingVisual.name}" has been updated.`
    });
  };

  const handleDeleteVisual = (id: string) => {
    setVisualAssets(prev => prev.filter(vis => vis.id !== id));
    
    toast({
      title: "Visual asset deleted",
      description: "The visual asset has been deleted."
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Story Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Stories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storyCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.storyCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCategory(category)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          title="Delete"
                          className="text-destructive"
                          disabled={category.storyCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Add New Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="Enter category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddCategory} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {editingCategory && (
          <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the category name below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editCategoryName">Category Name</Label>
                  <Input
                    id="editCategoryName"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCategory}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Visual Assets</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visualAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded overflow-hidden mr-2">
                          <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
                        </div>
                        {asset.name}
                      </div>
                    </TableCell>
                    <TableCell>{asset.type === "background" ? "Background" : "Image"}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingVisual(asset)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteVisual(asset.id)}
                          title="Delete"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GalleryHorizontal className="mr-2 h-5 w-5" />
                  Add Visual Asset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visualName">Asset Name</Label>
                    <Input
                      id="visualName"
                      placeholder="Enter asset name"
                      value={newVisualName}
                      onChange={(e) => setNewVisualName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="visualUrl">Asset URL</Label>
                    <Input
                      id="visualUrl"
                      placeholder="https://example.com/image.jpg"
                      value={newVisualUrl}
                      onChange={(e) => setNewVisualUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="visualType">Asset Type</Label>
                    <select
                      id="visualType"
                      className="w-full rounded-md border border-input p-2"
                      value={newVisualType}
                      onChange={(e) => setNewVisualType(e.target.value as "background" | "image")}
                    >
                      <option value="image">Image</option>
                      <option value="background">Background</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="visualCategory">Asset Category</Label>
                    <Input
                      id="visualCategory"
                      placeholder="Enter category"
                      value={newVisualCategory}
                      onChange={(e) => setNewVisualCategory(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={handleAddVisual} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Visual Asset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {editingVisual && (
          <Dialog open={!!editingVisual} onOpenChange={(open) => !open && setEditingVisual(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Visual Asset</DialogTitle>
                <DialogDescription>
                  Update the visual asset details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editVisualName">Asset Name</Label>
                  <Input
                    id="editVisualName"
                    value={editingVisual.name}
                    onChange={(e) => setEditingVisual({...editingVisual, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editVisualUrl">Asset URL</Label>
                  <Input
                    id="editVisualUrl"
                    value={editingVisual.url}
                    onChange={(e) => setEditingVisual({...editingVisual, url: e.target.value})}
                  />
                  {editingVisual.url && (
                    <div className="mt-2 h-20 w-full rounded overflow-hidden">
                      <img src={editingVisual.url} alt={editingVisual.name} className="h-full w-auto object-cover" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editVisualType">Asset Type</Label>
                  <select
                    id="editVisualType"
                    className="w-full rounded-md border border-input p-2"
                    value={editingVisual.type}
                    onChange={(e) => setEditingVisual({...editingVisual, type: e.target.value as "background" | "image"})}
                  >
                    <option value="image">Image</option>
                    <option value="background">Background</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editVisualCategory">Asset Category</Label>
                  <Input
                    id="editVisualCategory"
                    value={editingVisual.category}
                    onChange={(e) => setEditingVisual({...editingVisual, category: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingVisual(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateVisual}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
