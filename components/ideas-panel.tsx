"use client";

import { useState } from "react";
import {
  Lightbulb,
  ChevronRight,
  FlaskConical,
  AlertTriangle,
  BookOpen,
  Play,
} from "lucide-react";
import type { ResearchIdea } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IdeasPanelProps {
  ideas: ResearchIdea[];
  selectedIdea: ResearchIdea | null;
  onSelectIdea: (idea: ResearchIdea) => void;
  onRunExperiment: (idea: ResearchIdea) => void;
}

export function IdeasPanel({
  ideas,
  selectedIdea,
  onSelectIdea,
  onRunExperiment,
}: IdeasPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["hypothesis", "experiments"])
  );

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setExpandedSections(newSections);
  };

  return (
    <div className="flex h-full">
      {/* Ideas List */}
      <div className="w-80 shrink-0 border-r border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" />
            <h2 className="font-medium">Research Ideas</h2>
          </div>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {ideas.length}
          </span>
        </div>

        <div className="overflow-y-auto">
          {ideas.map((idea, index) => (
            <button
              key={idea.Name}
              onClick={() => onSelectIdea(idea)}
              className={cn(
                "w-full border-b border-border p-4 text-left transition-colors",
                selectedIdea?.Name === idea.Name
                  ? "bg-secondary"
                  : "hover:bg-secondary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-foreground">
                    {idea.Name.replace(/_/g, " ")}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {idea["Short Hypothesis"]}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Idea Details */}
      <div className="flex-1 overflow-y-auto">
        {selectedIdea ? (
          <div className="p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-balance text-xl font-semibold text-foreground">
                  {selectedIdea.Title}
                </h1>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {selectedIdea.Name}
                </p>
              </div>
              <button
                onClick={() => onRunExperiment(selectedIdea)}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Play className="h-4 w-4" />
                Run Experiment
              </button>
            </div>

            {/* Hypothesis Section */}
            <CollapsibleSection
              title="Hypothesis"
              icon={<Lightbulb className="h-4 w-4 text-warning" />}
              expanded={expandedSections.has("hypothesis")}
              onToggle={() => toggleSection("hypothesis")}
            >
              <p className="text-sm leading-relaxed text-foreground/90">
                {selectedIdea["Short Hypothesis"]}
              </p>
            </CollapsibleSection>

            {/* Abstract Section */}
            <CollapsibleSection
              title="Abstract"
              icon={<BookOpen className="h-4 w-4 text-primary" />}
              expanded={expandedSections.has("abstract")}
              onToggle={() => toggleSection("abstract")}
            >
              <p className="text-sm leading-relaxed text-foreground/90">
                {selectedIdea.Abstract}
              </p>
            </CollapsibleSection>

            {/* Related Work Section */}
            <CollapsibleSection
              title="Related Work"
              icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
              expanded={expandedSections.has("related")}
              onToggle={() => toggleSection("related")}
            >
              <p className="text-sm leading-relaxed text-foreground/90">
                {selectedIdea["Related Work"]}
              </p>
            </CollapsibleSection>

            {/* Experiments Section */}
            <CollapsibleSection
              title="Proposed Experiments"
              icon={<FlaskConical className="h-4 w-4 text-accent" />}
              expanded={expandedSections.has("experiments")}
              onToggle={() => toggleSection("experiments")}
            >
              <ol className="space-y-3">
                {selectedIdea.Experiments.map((exp, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90">
                      {exp}
                    </span>
                  </li>
                ))}
              </ol>
            </CollapsibleSection>

            {/* Risk Factors Section */}
            <CollapsibleSection
              title="Risk Factors & Limitations"
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
              expanded={expandedSections.has("risks")}
              onToggle={() => toggleSection("risks")}
            >
              {Array.isArray(selectedIdea["Risk Factors and Limitations"]) ? (
                <ul className="space-y-2">
                  {selectedIdea["Risk Factors and Limitations"].map(
                    (risk, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/90">
                        <span className="text-destructive">-</span>
                        {risk}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-foreground/90">
                  {selectedIdea["Risk Factors and Limitations"]}
                </p>
              )}
            </CollapsibleSection>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                Select an idea to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-border bg-card">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/50"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            expanded && "rotate-90"
          )}
        />
      </button>
      {expanded && (
        <div className="border-t border-border bg-background/50 px-4 py-4">
          {children}
        </div>
      )}
    </div>
  );
}
