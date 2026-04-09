import { motion } from "framer-motion";
import { ChevronRight, Bot } from "lucide-react";

interface AgentCardProps {
  agent: {
    id: string;
    title: string;
    description: string;
  };
  index: number;
  onClick: () => void;
}

const AgentCard = ({ agent, index, onClick }: AgentCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card p-5 text-left shadow-sm transition-shadow duration-300 hover:shadow-lg hover:border-primary/30"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary text-2xl shadow-sm border border-primary/20 transition-transform duration-300 group-hover:scale-110">
            <Bot className="h-6 w-6" />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-1 truncate">
          {agent.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          Live AI Agent
        </p>
      </div>
    </motion.button>
  );
};

export default AgentCard;
