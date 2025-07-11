
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Globe } from "lucide-react";

interface ExploreCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ExploreCategoryFilter = ({ selectedCategory, onCategoryChange }: ExploreCategoryFilterProps) => {
  const categories = [
    { id: "all", label: "All", icon: Globe },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "community", label: "Community", icon: Users },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className="flex items-center gap-2"
          >
            <IconComponent className="h-4 w-4" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ExploreCategoryFilter;
