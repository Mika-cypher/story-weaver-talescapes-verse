import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scroll, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { culturalCategoriesService, CulturalCategory } from "@/services/culturalCategoriesService";

interface CulturalCategorySelectorProps {
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
}

export const CulturalCategorySelector: React.FC<CulturalCategorySelectorProps> = ({
  selectedCategoryId,
  onCategorySelect
}) => {
  const [categories, setCategories] = useState<CulturalCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await culturalCategoriesService.getCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };

    loadCategories();
  }, []);

  const getCategoryIcon = (name: string) => {
    if (name.toLowerCase().includes('folk') || name.toLowerCase().includes('traditional')) {
      return <Scroll className="h-4 w-4" />;
    }
    if (name.toLowerCase().includes('contemporary') || name.toLowerCase().includes('modern')) {
      return <Sparkles className="h-4 w-4" />;
    }
    return <Globe className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cultural Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Cultural Category
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a cultural category that best represents your story's heritage
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => onCategorySelect(
                  selectedCategoryId === category.id ? undefined : category.id
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${selectedCategoryId === category.id ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">{category.name}</div>
                    {category.description && (
                      <div className={`text-xs leading-relaxed ${
                        selectedCategoryId === category.id 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}>
                        {category.description}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {selectedCategoryId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4 border-t"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  Selected Category
                </Badge>
                <span className="text-sm font-medium">
                  {categories.find(c => c.id === selectedCategoryId)?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategorySelect(undefined)}
                className="text-xs"
              >
                Clear Selection
              </Button>
            </div>
          </motion.div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No cultural categories available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};