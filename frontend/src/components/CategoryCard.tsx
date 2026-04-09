import { Category } from "@/lib/data";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg bg-card p-4 shadow-sm border border-border/50 transition-all active:scale-[0.98] hover:shadow-md"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${category.color}`}>
        {category.icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-foreground">{category.name}</p>
        <p className="text-sm text-muted-foreground">{category.count} recordings</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
};

export default CategoryCard;
