import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Phone, Clock, Calendar, Eye, CheckCircle2, XCircle, AlertCircle, Loader2, ChevronDown, User, PhoneCall, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { callFromNumbers, CallHistoryEntry } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import CallDetailView from "@/components/CallDetailView";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const statusConfig = {
  completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-600", icon: CheckCircle2 },
  missed: { label: "Missed", color: "bg-red-500/15 text-red-500", icon: XCircle },
  "in-progress": { label: "In Progress", color: "bg-amber-500/15 text-amber-600", icon: Loader2 },
  failed: { label: "Failed", color: "bg-red-500/15 text-red-500", icon: AlertCircle },
};

const IndustryUseCases = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const navigate = useNavigate();
  
  // Dashboard State
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [templateName, setTemplateName] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [callFrom, setCallFrom] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ringgNumbers, setRinggNumbers] = useState<{id: string, label: string, number: string}[]>([]);

  // History State
  const [history, setHistory] = useState<CallHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallHistoryEntry | null>(null);

  const isRinggPowered = true;

  // 1. Initial Load: Fetch all agents for this industry
  useEffect(() => {
    const fetchAndFilterAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const id = industryId?.toLowerCase() || "";
        const brandMap: Record<string, string> = {
          "kshema": "Kshema Solutions",
          "sbi": "SBI Banking",
          "unionbank": "Union Bank EMI",
          "abc": "ABC Corporation",
          "realestate": "Real Estate"
        };
        
        const response = await api.fetchRinggAgents();
        const allAgents = response.data.agents;

        let brandName = brandMap[id];
        if (!brandName) {
            const sampleAgent = allAgents.find((a: any) => 
                (a.template_name || "General Agents").toLowerCase() === id);
            brandName = sampleAgent?.template_name || id;
        }
        setTemplateName(brandName);
        
        const filtered = allAgents
          .filter((agent: any) => {
             const agentName = (agent.agent_display_name || "").toUpperCase();
             const templateLower = (agent.template_name || "General Agents").toLowerCase();
             
             if (id === "kshema") return agentName.includes("KSHEMA");
             if (id === "sbi") return agentName.includes("SBI");
             if (id === "unionbank") return agentName.includes("UNION BANK") || agentName.includes("UNIONBANK");
             if (id === "abc") return agentName.includes("ABC");
             if (id === "realestate") return agentName.includes("REALESTATE") || agentName.includes("REAL ESTATE") || agentName.includes("REAL-ESTATE");
             return (templateLower === id);
          })
          .map((agent: any) => ({
            id: agent.id,
            title: agent.agent_display_name,
            description: `AI Agent (${agent.agent_type})`,
            template: agent.template_name || "General"
          }));
          
        setAgents(filtered);
        if (filtered.length > 0) {
            setSelectedAgentId(filtered[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch industry agents:", error);
      } finally {
        setIsLoadingAgents(false);
      }
    };
    fetchAndFilterAgents();
  }, [industryId]);

  // 2. Fetch Numbers (Workspace)
  useEffect(() => {
      const fetchNumbers = async () => {
          try {
              const numbersResponse = await api.fetchRinggNumbers();
              const numbers = numbersResponse.workspace_numbers.map((n: any) => ({
                  id: n.id,
                  label: n.display_name || "Ringg",
                  number: n.number
              }));
              setRinggNumbers(numbers);
              if (numbers.length > 0) setCallFrom(numbers[0].id);
          } catch (e) { console.error(e); }
      };
      fetchNumbers();
  }, []);

  // 3. Dynamic Selection Logic
  const fetchHistory = async (targetAgentId?: string) => {
    const agentIdToFetch = targetAgentId || selectedAgentId;
    if (!agentIdToFetch) return;
    
    setIsLoadingHistory(true);
    try {
      const id = industryId?.toLowerCase() || "";
      const nameFilterMap: Record<string, string> = {
        "kshema": "Kshema",
        "sbi": "SBI",
        "unionbank": "Union Bank",
        "abc": "ABC",
        "realestate": "Real Estate"
      };
      
      const currentAgent = agents.find(a => a.id === agentIdToFetch);
      const nameFilter = currentAgent?.title || nameFilterMap[id];
      
      const data = await api.fetchRinggHistory(agentIdToFetch, nameFilter);
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
      
      // Auto-fill from recent history ONLY IF fields are empty
      if (mappedData.length > 0 && !name && !mobile) {
        setMobile(mappedData[0].callerNumber);
        setName(mappedData[0].callerName);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (selectedAgentId) {
        fetchHistory(selectedAgentId);
        // Clear personal details on swap to prevent cross-agent data entry
        setName("");
        setMobile("");
    }
  }, [selectedAgentId]);

  // 4. Polling for Live updates
  useEffect(() => {
    if (!selectedAgentId) return;
    const interval = setInterval(() => {
        fetchHistory();
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedAgentId, history.length]);

  const handleCallNow = async () => {
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!mobile.trim() || mobile.length < 10) { toast.error("Valid mobile required"); return; }
    if (!selectedAgentId) return;

    setIsSubmitting(true);
    try {
      await api.initiateCall({
        name,
        mobile,
        callFrom, 
        useCaseId: selectedAgentId
      });
      toast.success("Call initiated! Form cleared.");
      setName("");
      setMobile("");
      if (ringgNumbers.length > 0) setCallFrom(ringgNumbers[0].id);
      fetchHistory();
      setTimeout(fetchHistory, 5000);
    } catch (error) {
      toast.error("Failed to initiate call.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="mx-auto h-screen overflow-hidden w-full bg-background font-inter flex flex-col">
      <div className="px-4 md:px-12 lg:px-24 pt-6 md:pt-12 lg:pt-16 flex-1 flex flex-col overflow-hidden">
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-primary/80 hover:text-primary transition-all group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 flex-1 overflow-hidden">
          {/* LEFT COLUMN: Agent Selection Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 border-r border-border/20 pr-4 lg:pr-8 overflow-y-auto pb-20 custom-scrollbar">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-foreground tracking-tight">{templateName}</h1>
                <p className="text-xs font-medium text-muted-foreground mt-1.5 uppercase tracking-widest">Active Solutions</p>
            </div>

            <div className="space-y-3">
              {isLoadingAgents ? (
                 <div className="py-12 flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                 </div>
              ) : (
                agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`w-full group relative flex items-center gap-4 rounded-2xl border p-4.5 text-left transition-all duration-300 ${
                      selectedAgentId === agent.id
                        ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                        : "border-border/40 bg-card hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        selectedAgentId === agent.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}>
                      <Bot className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-black truncate leading-tight ${selectedAgentId === agent.id ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                        {agent.title}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-wider">{agent.template}</p>
                    </div>
                    {selectedAgentId === agent.id && (
                        <motion.div layoutId="activeDot" className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Form & Contextual History */}
          <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
            {!selectedAgentId ? (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/50">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
                        <Bot className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground tracking-wide">Select an agent list from the left column</p>
                </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10 h-full overflow-hidden">
                {/* 1. CALL MANAGEMENT FORM */}
                <motion.div
                   key={`form-${selectedAgentId}`}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-6"
                >
                  <div className="rounded-[32px] bg-card p-8 shadow-xl shadow-foreground/5 border border-border/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                         <PhoneCall className="h-24 w-24" />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <PhoneCall className="h-7 w-7" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-foreground">Call {selectedAgent?.title}</h2>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Live Agent Interaction</p>
                      </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Your Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border-2 border-muted bg-background pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Target Number</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <input
                            type="tel"
                            placeholder="+91 00000 00000"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full rounded-2xl border-2 border-muted bg-background pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Origin Gateway</label>
                        <div className="relative group">
                          <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <select
                            value={callFrom}
                            onChange={(e) => setCallFrom(e.target.value)}
                            className="w-full appearance-none rounded-2xl border-2 border-muted bg-background pl-12 pr-12 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                          >
                            {ringgNumbers.map((num) => (
                              <option key={num.id} value={num.id}>
                                {num.label} — {num.number}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      <button
                        onClick={handleCallNow}
                        disabled={isSubmitting}
                        className="w-full rounded-[20px] bg-primary py-5 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-[0.98] hover:shadow-2xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="h-5 w-5 animate-spin" /> ESTABLISHING LINK...</>
                        ) : (
                          <><Phone className="h-5 w-5" /> INITIATE CALL NOW</>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* 2. LIVE INTERACTION LOGS */}
                <motion.div
                  key={`history-${selectedAgentId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[32px] bg-card border border-border/40 shadow-xl shadow-foreground/5 overflow-hidden flex flex-col h-[600px] xl:h-[calc(100vh-280px)]"
                >
                  <div className="p-8 border-b border-border/30 flex items-center justify-between bg-muted/5 sticky top-0 z-10 backdrop-blur-md">
                    <div>
                        <h2 className="text-xl font-black text-foreground">Usage Analytics</h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Contextual Logs</p>
                    </div>
                    <button 
                      onClick={() => fetchHistory()}
                      disabled={isLoadingHistory}
                      className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-[10px] font-black text-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-50 shadow-sm"
                    >
                      <Loader2 className={`h-3.5 w-3.5 ${isLoadingHistory ? "animate-spin" : ""}`} />
                      SYNC NOW
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1 custom-scrollbar scroll-smooth">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/20">
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/30">Timestamp</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/30 text-center">Status</th>
                          <th className="px-8 py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/30">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        <AnimatePresence>
                        {history.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-8 py-32 text-center">
                              <div className="flex flex-col items-center">
                                  <Clock className="h-10 w-10 text-muted-foreground/20 mb-4" />
                                  <p className="text-xs font-bold text-muted-foreground/60 tracking-wider">NO INTERACTION DATA FOUND</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          history.map((entry, idx) => {
                            const statusInfo = statusConfig[entry.status as keyof typeof statusConfig] || statusConfig.failed;
                            const SIcon = statusInfo.icon;
                            return (
                              <motion.tr 
                                key={entry.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group hover:bg-primary/[0.02] transition-colors"
                              >
                                <td className="px-8 py-5">
                                  <div className="space-y-0.5">
                                      <p className="text-xs font-black text-foreground">
                                        {new Date(entry.date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                                      </p>
                                      <p className="text-[10px] font-bold text-muted-foreground">
                                        {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                      </p>
                                  </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                                    <SIcon className="h-3 w-3" />
                                    {statusInfo.label}
                                  </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                  <button
                                    onClick={() => setSelectedCall(entry)}
                                    className="inline-flex items-center justify-center rounded-xl border-2 border-primary/20 bg-primary/5 px-5 py-2 text-xs font-black text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                  >
                                    DETAILS
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
            )}
          </div>
        </div>
      </div>

      <BottomNav active="home" onChange={(tab: any) => {
        if (tab === "home") navigate("/");
        else navigate(`/?tab=${tab}`);
      }} />

      {/* Deep Analysis Sheet */}
      <Sheet open={!!selectedCall} onOpenChange={(open) => !open && setSelectedCall(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto p-0 border-l border-border/40 shadow-2xl">
          <SheetTitle className="sr-only">Deep Analysis Platform</SheetTitle>
          {selectedCall && selectedAgent && (
            <CallDetailView
              call={selectedCall}
              useCase={selectedAgent}
              category={{ name: templateName, icon: "🏢" } as any}
              onBack={() => setSelectedCall(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default IndustryUseCases;
