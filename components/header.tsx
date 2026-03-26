"use client";

import { FlaskConical, Github, FileText, Settings } from "lucide-react";
import type { NavigationTab } from "@/frontend/types";
import { cn } from "@/frontend/utils";

interface HeaderProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

const tabs: { id: NavigationTab; label: string }[] = [
  { id: "ideas", label: "Ideas" },
  { id: "experiments", label: "Experiments" },
  { id: "configuration", label: "Configuration" },
  { id: "logs", label: "Logs" },
  { id: "papers", label: "Papers" },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">
              AI Scientist
            </span>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              v2
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/SakanaAI/AI-Scientist-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href="https://pub.sakana.ai/ai-scientist-v2/paper"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Paper</span>
          </a>
          <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
