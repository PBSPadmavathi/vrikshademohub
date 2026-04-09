import { Home, Library, Info } from "lucide-react";
import { Tab } from "@/pages/Index";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs = [
  { id: "home" as Tab, label: "Home", icon: Home },
  { id: "how" as Tab, label: "How it Works", icon: Info },
];

const BottomNav = ({ active, onChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 z-50 border-t md:border-t-0 md:border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1400px] xl:max-w-screen-2xl items-center justify-around md:justify-end md:gap-8 py-2 md:py-4 px-4 md:px-12 lg:px-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-4 md:px-2 py-1.5 text-xs md:text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
