import { useState, useCallback } from "react";
import BottomNav from "@/components/BottomNav";
import HomeTab from "@/components/HomeTab";
import LibraryTab from "@/components/LibraryTab";
import HowItWorksTab from "@/components/HowItWorksTab";
import AudioPlayerBar from "@/components/AudioPlayerBar";
import { CallRecording } from "@/lib/data";

export type Tab = "home" | "library" | "how";

const Index = () => {
  const [tab, setTab] = useState<Tab>("home");
  const [currentCall, setCurrentCall] = useState<CallRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayCall = useCallback(
    (call: CallRecording) => {
      if (currentCall?.id === call.id) {
        setIsPlaying((p) => !p);
      } else {
        setCurrentCall(call);
        setIsPlaying(true);
      }
    },
    [currentCall]
  );

  const handleClosePlayer = useCallback(() => {
    setCurrentCall(null);
    setIsPlaying(false);
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1400px] xl:max-w-screen-2xl bg-background">
      {tab === "home" && <HomeTab onGoToLibrary={() => setTab("library")} />}
      {tab === "library" && <LibraryTab currentCall={isPlaying ? currentCall : null} onPlayCall={handlePlayCall} />}
      {tab === "how" && <HowItWorksTab />}

      <AudioPlayerBar
        call={currentCall}
        isPlaying={isPlaying}
        onToggle={() => setIsPlaying((p) => !p)}
        onClose={handleClosePlayer}
      />

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
