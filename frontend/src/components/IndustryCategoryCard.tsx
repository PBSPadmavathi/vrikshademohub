import { Category } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface IndustryCategoryCardProps {
  category: Category;
  index: number;
  onClick: () => void;
}

const IndustryCategoryCard = ({ category, index, onClick }: IndustryCategoryCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card p-5 text-left shadow-sm transition-shadow duration-300 hover:shadow-lg hover:border-primary/30"
    >
      {/* Gradient background overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and arrow row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm text-3xl shadow-sm border border-border/30">
            {category.icon}
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 translate-x-[-4px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* Title and Count */}
        <div className="flex flex-col">
          <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
            {category.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-3">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
               {category.useCases?.length || 0} Active Agents
             </span>
          </div>

          {/* Agent Names Preview */}
          <div className="flex flex-wrap gap-1.5 mt-1 border-t border-border/20 pt-3">
            {category.useCases?.slice(0, 3).map((uc, i) => (
              <span key={uc.id} className="text-[10px] bg-background/50 px-2 py-0.5 rounded-md text-muted-foreground border border-border/30">
                {uc.title}
              </span>
            ))}
            {(category.useCases?.length || 0) > 3 && (
              <span className="text-[10px] text-muted-foreground/60 px-1 pt-0.5">
                +{(category.useCases?.length || 0) - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default IndustryCategoryCard;
