
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const StoryFilters: React.FC<StoryFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search stories..."
            className="pl-10 bg-background text-foreground"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[180px] bg-background text-foreground">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-foreground">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StoryFilters;
