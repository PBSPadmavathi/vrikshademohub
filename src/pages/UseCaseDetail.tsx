import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Clock, Calendar, Eye, CheckCircle2, XCircle, AlertCircle, Loader2, ChevronDown, User, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUseCaseById, callFromNumbers, CallHistoryEntry, categories } from "@/lib/data";
import { api } from "@/lib/api";
import CallDetailView from "@/components/CallDetailView";
import BottomNav from "@/components/BottomNav";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const statusConfig = {
  completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-600", icon: CheckCircle2 },
  missed: { label: "Missed", color: "bg-red-500/15 text-red-500", icon: XCircle },
  "in-progress": { label: "In Progress", color: "bg-amber-500/15 text-amber-600", icon: Loader2 },
  failed: { label: "Failed", color: "bg-red-500/15 text-red-500", icon: AlertCircle },
};

const UseCaseDetail = () => {
  const { industryId, useCaseId } = useParams<{ industryId: string; useCaseId: string }>();
  const navigate = useNavigate();

  const result = getUseCaseById(useCaseId || "");


  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [callFrom, setCallFrom] = useState(callFromNumbers[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<CallHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallHistoryEntry | null>(null);

  const [ringgAgent, setRinggAgent] = useState<any>(null);
  const [ringgNumbers, setRinggNumbers] = useState<{id: string, label: string, number: string}[]>([]);
  const [isFetchingDetails, setIsFetchingDetails] = useState(true);

  const isRinggPowered = true; // All industries are now dynamic

  const fetchHistory = async (agentNameOverride?: string) => {
    if (!useCaseId) return;
    try {
      let data;
      const id = industryId?.toLowerCase() || "";
      const isBrandedGroup = ["kshema", "sbi", "unionbank", "abc", "realestate"].includes(id);
      
      if (isRinggPowered) {
        // Map simplified industryId to searchable brand pattern
        const nameFilterMap: Record<string, string> = {
          "kshema": "Kshema",
          "sbi": "SBI",
          "unionbank": "Union Bank",
          "abc": "ABC",
          "realestate": "Real Estate"
        };
        
        // Use either the branded group filter OR the specific agent name
        const nameFilter = agentNameOverride || (isBrandedGroup ? nameFilterMap[id] : undefined);
        
        // Pass useCaseId to get exact history for this specific agent.
        // We still provide nameFilter for branded context in the backend search if needed.
        data = await api.fetchRinggHistory(useCaseId, nameFilter);
      } else {
        data = await api.fetchCallHistory(useCaseId);
      }
      
      const mappedData: CallHistoryEntry[] = data.map((item: any) => ({
        id: item.id,
        useCaseId: item.use_case_id,
        date: item.date,
        status: item.status,
        duration: item.duration,
        callerName: item.caller_name,
        callerNumber: item.caller_number,
        callFromNumber: item.call_from_number,
        summary: item.summary,
        transcript: item.transcript,
        audioUrl: item.audio_url
      }));
      setHistory(mappedData);
      
      // Auto-fill mobile number from most recent history entry if not already set
      if (mappedData.length > 0 && !mobile) {
        setMobile(mappedData[0].callerNumber);
        setName(mappedData[0].callerName);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchRinggData = async () => {
      if (isRinggPowered && useCaseId) {
          setIsFetchingDetails(true);
          try {
              // 1. Fetch Agents
              const agentsResponse = await api.fetchRinggAgents();
              const agents = agentsResponse.data.agents;
              const agent = agents.find((a: any) => a.id === useCaseId);
              
              if (agent) {
                  const agentName = agent.agent_display_name;
                  setRinggAgent({
                      id: agent.id,
                      title: agentName,
                      description: `AI Agent (${agent.agent_type}) - Optimized for ${agent.template_name || "General Assistant"}`,
                      icon: "🤖",
                  });
                  // Immediately fetch history based on NAME
                  fetchHistory(agentName);
              }

              // 2. Fetch Numbers
              const numbersResponse = await api.fetchRinggNumbers();
              const numbers = numbersResponse.workspace_numbers.map((n: any) => ({
                  id: n.id,
                  label: n.display_name || "Ringg",
                  number: n.number
              }));
              setRinggNumbers(numbers);
              if (numbers.length > 0) {
                  setCallFrom(numbers[0].id);
              }
          } catch (error) {
              console.error("Failed to fetch Ringg details:", error);
          } finally {
              setIsFetchingDetails(false);
          }
      } else {
          setIsFetchingDetails(false);
      }
  }

  useEffect(() => {
    // Initial fetch (generic or branded group)
    fetchHistory();
    // Detail fetch + name-based history fetch
    fetchRinggData();
  }, [useCaseId, industryId]);

  // Polling logic...
  useEffect(() => {
    const hasInProgress = history.some(item => item.status === "in-progress");
    
    if (hasInProgress || isRinggPowered) {
      const interval = setInterval(() => {
          fetchHistory(ringgAgent?.title);
      }, hasInProgress ? 3000 : 10000);
      return () => clearInterval(interval);
    }
  }, [history, industryId, ringgAgent]);

  if (isFetchingDetails) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[1400px] xl:max-w-screen-2xl bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
      </div>
    );
  }

  if (!result && !ringgAgent) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[1400px] xl:max-w-screen-2xl bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-foreground mb-2">Use Case Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">The use case you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/")} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all active:scale-95">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const useCase = isRinggPowered ? ringgAgent : result?.useCase;
  
  // Create a pseudo-category for branded groups
  const brandedCategoryMap: Record<string, any> = {
    "kshema": { name: "Kshema Solutions", icon: "🌾" },
    "sbi": { name: "SBI Banking", icon: "🏛️" },
    "unionbank": { name: "Union Bank EMI", icon: "🏦" },
    "abc": { name: "ABC Corporation", icon: "🏢" },
    "realestate": { name: "Real Estate", icon: "🏠" }
  };
  
  let categoryName = "Industry Group";
  let categoryIcon = "🤖";

  const id = industryId?.toLowerCase() || "";
  if (brandedCategoryMap[id]) {
      categoryName = brandedCategoryMap[id].name;
      categoryIcon = brandedCategoryMap[id].icon;
  } else if (industryId) {
      categoryName = decodeURIComponent(industryId);
  }

  const category = isRinggPowered ? { name: categoryName, icon: categoryIcon } : result?.category;

  if (!useCase || !category) return null;

  const handleCallNow = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.initiateCall({
        name,
        mobile,
        callFrom: callFrom, 
        useCaseId: useCaseId || ""
      });
      toast.success("Call initiated! You will receive a call shortly.");
      
      // Reset form fields
      setName("");
      setMobile("");
      
      // Immediate refresh and then poll
      fetchHistory(ringgAgent?.title);
      setTimeout(() => fetchHistory(ringgAgent?.title), 5000);
    } catch (error) {
      toast.error("Failed to initiate call. Please check if the backend is running.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1400px] xl:max-w-screen-2xl bg-background">
      <div className="px-4 md:px-12 lg:px-20 pb-24 md:pb-16 pt-6 md:pt-24 lg:pt-32">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/industry/${industryId}`)}
          className="mb-5 flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agent List
        </motion.button>

        {/* Use Case Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              {useCase.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{useCase.title}</h1>
              <p className="text-xs text-muted-foreground">{category.name}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">{useCase.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            {/* Call Me Now Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 rounded-2xl bg-card p-5 shadow-sm border border-border/50"
            >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <PhoneCall className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Call Me Now</h2>
              <p className="text-xs text-muted-foreground">Experience this use case with a live AI call</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Name field */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                />
              </div>
            </div>

            {/* Mobile Number field */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                />
              </div>
            </div>

            {/* Call From dropdown */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Call From</label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={callFrom}
                  onChange={(e) => setCallFrom(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow cursor-pointer"
                >
                  {(isRinggPowered ? ringgNumbers : callFromNumbers).map((num) => (
                    <option key={num.id} value={num.id}>
                      {num.label} — {num.number}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleCallNow}
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all active:scale-[0.98] hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4" />
                  Call Me Now
                </>
              )}
            </button>
          </div>
          </motion.div>
          </div>

          <div className="lg:sticky lg:top-32 h-fit">
            {/* Call History Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border/30 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Call History</h2>
                <button 
                  onClick={() => fetchHistory(ringgAgent?.title)}
                  disabled={isLoadingHistory}
                  className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-50"
                >
                  <Loader2 className={`h-3.5 w-3.5 ${isLoadingHistory ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Duration</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <AnimatePresence>
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-xs text-muted-foreground">
                            {isLoadingHistory ? "Loading call logs..." : "No call history found for this agent."}
                          </td>
                        </tr>
                      ) : (
                        history.map((entry, index) => {
                          const statusInfo = statusConfig[entry.status as keyof typeof statusConfig] || statusConfig.failed;
                          return (
                            <motion.tr
                              key={entry.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="group hover:bg-muted/20 transition-colors"
                            >
                              <td className="px-5 py-4">
                                <p className="text-xs font-medium text-foreground">
                                  {new Date(entry.date).toLocaleString("en-IN", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                    hour12: true
                                  })}
                                </p>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-xs text-muted-foreground">
                                {entry.duration || "0s"}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button
                                  onClick={() => setSelectedCall(entry)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors active:scale-95"
                                >
                                  View
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <BottomNav active="home" onChange={(tab) => {
        if (tab === "home") navigate("/");
        else navigate(`/?tab=${tab}`);
      }} />

      <Sheet open={!!selectedCall} onOpenChange={(open) => !open && setSelectedCall(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto p-0 border-l border-border/50">
          <SheetTitle className="sr-only">Call Details</SheetTitle>
          {selectedCall && (
            <CallDetailView
              call={selectedCall}
              useCase={useCase}
              category={category as any}
              onBack={() => setSelectedCall(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UseCaseDetail;
