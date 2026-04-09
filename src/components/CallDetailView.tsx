import { ArrowLeft, Play, Pause, Clock, Calendar, Phone, User, Bot, FileText, Info, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CallHistoryEntry, UseCase, Category } from "@/lib/data";

interface CallDetailViewProps {
  call: CallHistoryEntry;
  useCase: UseCase;
  category: Category;
  onBack: () => void;
}

const CallDetailView = ({ call, useCase, category, onBack }: CallDetailViewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "transcript">("details");

  const togglePlay = () => {
    const audio = document.getElementById("call-audio") as HTMLAudioElement;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(console.error);
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = (e: any) => {
    const a = e.target;
    setProgress((a.currentTime / a.duration) * 100 || 0);
  };

  return (
    <div className="bg-background flex flex-col h-full bg-card">
      <div className="px-6 py-6 border-b border-border/30 flex items-center justify-between sticky top-0 bg-card z-20">
        <h2 className="text-xl font-bold text-foreground">Call Details</h2>
        <button onClick={onBack} className="p-1 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="px-6 py-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Tab Switcher */}
        <div className="flex border-b border-border/30 mb-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "details"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Details & Analysis
            {activeTab === "details" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("transcript")}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "transcript"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Transcript
            {activeTab === "transcript" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Audio Recording Section */}
            <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Call Recording</p>
              <div className="flex items-center gap-4 bg-card rounded-xl p-3 border border-border/30">
                  <audio
                    id="call-audio"
                    src={call.audioUrl}
                    onTimeUpdate={onTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  <button
                    onClick={togglePlay}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all active:scale-90"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                  </button>
                  <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1.5">
                          <motion.div
                            className="h-full bg-primary"
                            style={{ width: `${progress}%` }}
                          />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                          <span>0:00</span>
                          <span>{call.duration}</span>
                      </div>
                  </div>
              </div>
            </div>

            {/* Call Information Section */}
            <div className="rounded-xl border border-border/50 p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Call Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">Date:</span>
                    <span className="text-muted-foreground">{new Date(call.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">Duration:</span>
                    <span className="text-muted-foreground">{call.duration}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">Status:</span>
                    <span className="text-emerald-600 font-semibold">{call.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">Type:</span>
                    <span className="text-muted-foreground">Outbound</span>
                </div>
              </div>
            </div>

            {/* Client Analysis Section */}
            <div className="rounded-xl border border-border/50 p-5 bg-card/50">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground">Client Analysis</h3>
                  <button className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline">
                      <Clock className="h-3 w-3" />
                      Refresh
                  </button>
              </div>
              <div>
                  <p className="text-xs font-bold text-foreground mb-2">Summary:</p>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                      {call.summary || "Generating automated analysis summary..."}
                  </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {call.transcript.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xs text-muted-foreground">No transcript available for this call.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {call.transcript.map((entry, index) => (
                        <div key={index} className="flex gap-4">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                entry.speaker === "ai" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                                {entry.speaker === "ai" ? "AI" : "User"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{entry.speaker === "ai" ? "Agent" : "Customer"}</p>
                                    <p className="text-[10px] text-muted-foreground">{entry.timestamp}</p>
                                </div>
                                <p className="text-xs text-foreground leading-relaxed">{entry.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CallDetailView;
