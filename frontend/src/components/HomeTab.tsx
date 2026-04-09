import { Phone, Headphones, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import IndustryCategoryCard from "./IndustryCategoryCard";

interface HomeTabProps {
  onGoToLibrary: () => void;
}

const HomeTab = ({ onGoToLibrary }: HomeTabProps) => {
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndGroupAgents = async () => {
      try {
        console.log("Fetching agents from Ringg API...");
        const response = await api.fetchRinggAgents();
        console.log("Raw API Response:", response);

        const agents = response.data?.agents || [];
        console.log(`Fetched ${agents.length} agents total.`);

        // 1. Initial Branded Groups
        const groups: Record<string, any> = {
          "kshema": { 
              id: "kshema", name: "Kshema Solutions", icon: "🌾", 
              gradient: "from-emerald-500/10 via-teal-500/5 to-transparent", 
              description: "Custom solutions for Kshema operations.",
              useCases: [] 
          },
          "sbi": { 
              id: "sbi", name: "SBI Banking", icon: "🏛️", 
              gradient: "from-blue-600/10 via-indigo-500/5 to-transparent", 
              description: "Specialized banking agents for SBI.",
              useCases: [] 
          },
          "unionbank": { 
              id: "unionbank", name: "Union Bank EMI", icon: "🏦", 
              gradient: "from-red-600/10 via-rose-500/5 to-transparent", 
              description: "Specialized EMI agents for Union Bank.",
              useCases: [] 
          },
          "abc": { 
              id: "abc", name: "ABC Corporation", icon: "🏢", 
              gradient: "from-orange-500/10 via-amber-500/5 to-transparent", 
              description: "Enterprise voice agents for ABC Corp.",
              useCases: [] 
          },
          "realestate": { 
              id: "realestate", name: "Real Estate", icon: "🏠", 
              gradient: "from-blue-500/10 via-slate-500/5 to-transparent", 
              description: "Custom solutions for Real Estate operations.",
              useCases: [] 
          },
        };

        // 2. Map every agent to a group
        agents.forEach((agent: any) => {
          if (!agent || !agent.agent_display_name) return;

          const name = agent.agent_display_name.toUpperCase();
          const mappedAgent = {
            id: agent.id,
            title: agent.agent_display_name,
            description: `AI Agent (${agent.agent_type})`,
            icon: "🤖",
          };

          // Try brand matching first
          if (name.includes("KSHEMA")) {
            groups["kshema"].useCases.push(mappedAgent);
          } else if (name.includes("SBI")) {
            groups["sbi"].useCases.push(mappedAgent);
          } else if (name.includes("UNION BANK") || name.includes("UNIONBANK")) {
            groups["unionbank"].useCases.push(mappedAgent);
          } else if (name.includes("ABC")) {
            groups["abc"].useCases.push(mappedAgent);
          } else if (name.includes("REALESTATE") || name.includes("REAL ESTATE") || name.includes("REAL-ESTATE")) {
            groups["realestate"].useCases.push(mappedAgent);
          } else {
            // Group by template_name (Industry/Use Case)
            const template = agent.template_name || "General Agents";
            const groupId = encodeURIComponent(template.toLowerCase());
            
            if (!groups[groupId]) {
                groups[groupId] = {
                    id: groupId,
                    name: template,
                    icon: "🎙️",
                    gradient: "from-slate-500/10 via-gray-500/5 to-transparent",
                    description: `Custom ${template} use cases.`,
                    useCases: []
                };
            }
            groups[groupId].useCases.push(mappedAgent);
          }
        });

        // 3. Finalize groups (Handle single agents and visibility)
        const categories = Object.values(groups)
            .filter(g => g.useCases.length > 0)
            .map(g => {
                // If a group has only 1 agent AND it's not a branded core group, 
                // use the agent's name as the industry name.
                const isBranded = ["kshema", "sbi", "unionbank", "abc"].includes(g.id);
                if (g.useCases.length === 1 && !isBranded) {
                    return {
                        ...g,
                        name: g.useCases[0].title
                    };
                }
                return g;
            });

        console.log("Final inclusive Industry Data:", categories);
        setDynamicCategories(categories);
      } catch (error) {
        console.error("Failed to fetch Ringg agents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndGroupAgents();
  }, []);

  return (
    <div className="px-4 md:px-12 lg:px-20 pb-24 md:pb-16 pt-6 md:pt-24 lg:pt-32">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-foreground">
          Vriksha <span className="text-primary italic">AI</span>
        </h1>
        <p className="mt-2 text-base md:text-xl text-muted-foreground">
          Branded voice automation for enterprise operations.
        </p>
      </motion.div>

      {/* Branded Industry Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <h2 className="text-xl md:text-3xl font-bold text-foreground">Custom Industries</h2>
            </div>
            <p className="text-sm text-muted-foreground">Tailored solutions for your core brands</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-muted/20 border border-border/50">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40 mb-3" />
            <p className="text-sm text-muted-foreground animate-pulse font-medium">Categorizing your agents...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dynamicCategories.map((cat, index) => (
              <IndustryCategoryCard
                key={cat.id}
                category={cat}
                index={index}
                // Navigate to the industry list instead of the direct call form
                onClick={() => {
                  console.log(`Navigating to ${cat.name} agent list`);
                  navigate(`/industry/${cat.id}`);
                }}
              />
            ))}
            {dynamicCategories.length === 0 && (
                <div className="col-span-full py-16 text-center rounded-2xl bg-muted/20 border border-dashed border-border/50">
                    <p className="text-sm text-muted-foreground font-medium">No matching branded agents found in your Ringg account.</p>
                </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-primary/5 p-8 border border-primary/10 flex flex-col items-center justify-center text-center"
      >
          <div className="max-w-xl">
              <h3 className="text-xl font-bold text-foreground mb-2">Automated Brand Mapping</h3>
              <p className="text-sm text-muted-foreground">Your agents are dynamically categorized based on their naming patterns, ensuring the right experience for every brand.</p>
          </div>
      </motion.div>
    </div>
  );
};

export default HomeTab;
