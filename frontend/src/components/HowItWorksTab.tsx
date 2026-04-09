import { Phone, Bot, MessageSquare, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Phone,
    title: "Call is Initiated",
    desc: "AI agent dials the customer or receives an inbound call",
  },
  {
    icon: Bot,
    title: "AI Understands Intent",
    desc: "Natural language processing identifies the purpose of the call",
  },
  {
    icon: MessageSquare,
    title: "Smart Conversation",
    desc: "The agent responds naturally, handles objections, and follows the script",
  },
  {
    icon: BarChart3,
    title: "Insights & Reporting",
    desc: "Every call is recorded, transcribed, and analyzed for quality",
  },
];

const HowItWorksTab = () => {
  return (
    <div className="px-4 md:px-12 lg:px-20 pb-24 md:pb-16 pt-6 md:pt-24 lg:pt-32">
      <h2 className="mb-6 md:mb-10 text-xl md:text-3xl font-bold text-foreground">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 rounded-xl bg-card p-4 shadow-sm border border-border/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
              <span className="ml-auto shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {i + 1}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-xl bg-primary/5 p-5 text-center border border-primary/10"
      >
        <p className="text-sm font-medium text-foreground">Powered by Vriksha AI</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Enterprise-grade voice AI that scales across industries
        </p>
      </motion.div>
    </div>
  );
};

export default HowItWorksTab;
