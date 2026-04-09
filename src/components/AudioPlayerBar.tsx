import { Pause, Play, X } from "lucide-react";
import { CallRecording } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

interface AudioPlayerBarProps {
  call: CallRecording | null;
  isPlaying: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const AudioPlayerBar = ({ call, isPlaying, onToggle, onClose }: AudioPlayerBarProps) => {
  return (
    <AnimatePresence>
      {call && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-16 left-0 right-0 z-40 mx-3 rounded-xl bg-secondary p-3 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onToggle}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-secondary-foreground">{call.title}</p>
              <div className="mt-1.5 h-1 rounded-full bg-secondary-foreground/20">
                <div className="h-full w-1/3 rounded-full bg-primary transition-all" />
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-secondary-foreground/60 hover:text-secondary-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioPlayerBar;
