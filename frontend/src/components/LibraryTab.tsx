import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, recordings, CallRecording } from "@/lib/data";
import CategoryCard from "./CategoryCard";
import CallCard from "./CallCard";

interface LibraryTabProps {
  currentCall: CallRecording | null;
  onPlayCall: (call: CallRecording) => void;
}

const LibraryTab = ({ currentCall, onPlayCall }: LibraryTabProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCalls = selectedCategory
    ? recordings.filter((r) => r.category === selectedCategory)
    : [];

  const categoryName = categories.find((c) => c.id === selectedCategory)?.name;

  return (
    <div className="px-4 md:px-12 lg:px-20 pb-24 md:pb-16 pt-6 md:pt-24 lg:pt-32">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="mb-4 md:mb-8 text-xl md:text-3xl font-bold text-foreground">Call Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} onClick={() => setSelectedCategory(cat.id)} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="calls"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="mb-4 md:mb-8 text-xl md:text-3xl font-bold text-foreground">{categoryName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
              {filteredCalls.map((call) => (
                <CallCard
                  key={call.id}
                  call={call}
                  isPlaying={currentCall?.id === call.id}
                  onTogglePlay={() => onPlayCall(call)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryTab;
