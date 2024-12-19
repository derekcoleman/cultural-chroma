import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export const CategoryFilter = ({ selectedType, onSelectType }: CategoryFilterProps) => {
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-spotify-darkgray border-spotify-lightgray/20 text-white">
            {CATEGORIES.find(cat => cat.id === selectedType)?.label || "All Categories"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-spotify-darkgray border-spotify-lightgray/20 max-h-[300px] overflow-y-auto">
          {CATEGORIES.map((category) => (
            <DropdownMenuItem 
              key={category.id}
              onClick={() => onSelectType(category.id)} 
              className="text-white hover:bg-white/10 flex items-center gap-2"
            >
              {category.icon && <category.icon className="h-4 w-4" />}
              {category.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};