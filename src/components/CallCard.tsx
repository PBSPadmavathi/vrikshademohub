import { CallRecording } from "@/lib/data";
import { Play, Pause, Star } from "lucide-react";

interface CallCardProps {
  call: CallRecording;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const CallCard = ({ call, isPlaying, onTogglePlay }: CallCardProps) => {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-card p-3.5 shadow-sm border border-border/50">
      <button
        onClick={onTogglePlay}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform active:scale-90"
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-foreground text-sm">{call.title}</p>
          {call.isBest && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              <Star className="h-3 w-3 fill-current" />
              Best
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{call.duration}</p>
      </div>
    </div>
  );
};

export default CallCard;
