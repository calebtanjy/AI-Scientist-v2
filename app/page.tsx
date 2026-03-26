"use client";

import { useMemo, useState } from "react";
import { FlaskConical, Lightbulb, FileText, Activity } from "lucide-react";
import { Header } from "@/components/header";
import { IdeasPanel } from "@/components/ideas-panel";
import { ExperimentsPanel } from "@/components/experiments-panel";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { LogsPanel } from "@/components/logs-panel";
import { PapersPanel } from "@/components/papers-panel";
import { RunExperimentModal } from "@/components/run-experiment-modal";
import type { NavigationTab, ResearchIdea, ExperimentRun } from "@/frontend/types";
import { mockIdeas, mockExperimentRuns } from "@/frontend/mock-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("ideas");
  const [selectedIdea, setSelectedIdea] = useState<ResearchIdea | null>(
    mockIdeas[0] ?? null
  );
  const [selectedExperiment, setSelectedExperiment] =
    useState<ExperimentRun | null>(mockExperimentRuns[0] ?? null);
  const [experiments, setExperiments] =
    useState<ExperimentRun[]>(mockExperimentRuns);
  const [showRunModal, setShowRunModal] = useState(false);
  const [ideaToRun, setIdeaToRun] = useState<ResearchIdea | null>(null);

  const dashboardStats = useMemo(() => {
    const running = experiments.filter((exp) => exp.status === "running").length;
    const completed = experiments.filter(
      (exp) => exp.status === "completed"
    ).length;

    return [
      {
        label: "Ideas Available",
        value: String(mockIdeas.length),
        icon: Lightbulb,
        tone: "text-warning",
      },
      {
        label: "Active Runs",
        value: String(running),
        icon: Activity,
        tone: "text-primary",
      },
      {
        label: "Completed Runs",
        value: String(completed),
        icon: FlaskConical,
        tone: "text-accent",
      },
      {
        label: "Generated Papers",
        value: String(
          experiments.filter((exp) => exp.status === "completed" && exp.results?.paperPath)
            .length
        ),
        icon: FileText,
        tone: "text-primary",
      },
    ];
  }, [experiments]);

  const handleRunExperiment = (idea: ResearchIdea) => {
    setIdeaToRun(idea);
    setShowRunModal(true);
  };

  const handleStartExperiment = (config: {
    experimentModel: string;
    writeupType: "normal" | "icbinb";
    loadCode: boolean;
    skipWriteup: boolean;
  }) => {
    if (!ideaToRun) return;

    const newExperiment: ExperimentRun = {
      id: `exp-${Date.now()}`,
      ideaName: ideaToRun.Name,
      status: "running",
      progress: 0,
      currentStage: "Initializing...",
      startTime: new Date().toISOString(),
      logs: [
        `[${formatTime(new Date())}] Starting experiment pipeline...`,
        `[${formatTime(new Date())}] Model: ${config.experimentModel}`,
        `[${formatTime(new Date())}] Paper format: ${config.writeupType}`,
      ],
    };

    setExperiments((prev) => [newExperiment, ...prev]);
    setSelectedExperiment(newExperiment);
    setActiveTab("experiments");
    setShowRunModal(false);

    simulateExperimentProgress(newExperiment.id);
  };

  const simulateExperimentProgress = (expId: string) => {
    const stages = [
      { progress: 10, stage: "Stage 1: Initializing tree search...", time: 2000 },
      { progress: 25, stage: "Stage 1: Exploring initial nodes...", time: 3000 },
      { progress: 40, stage: "Stage 2: Deep exploration phase...", time: 4000 },
      { progress: 55, stage: "Stage 2: Evaluating candidates...", time: 3000 },
      { progress: 70, stage: "Stage 3: Refinement phase...", time: 3000 },
      { progress: 85, stage: "Aggregating plots...", time: 2000 },
      { progress: 95, stage: "Generating paper writeup...", time: 4000 },
      { progress: 100, stage: "Complete!", time: 1000 },
    ];

    let stageIndex = 0;

    const runNextStage = () => {
      if (stageIndex >= stages.length) return;

      const { progress, stage, time } = stages[stageIndex];
      const currentTime = formatTime(new Date());

      setExperiments((prev) =>
        prev.map((exp) =>
          exp.id === expId
            ? {
                ...exp,
                progress,
                currentStage: stage,
                status: progress === 100 ? "completed" : "running",
                endTime: progress === 100 ? new Date().toISOString() : undefined,
                logs: [...exp.logs, `[${currentTime}] ${stage}`],
                results:
                  progress === 100
                    ? {
                        paperPath: `experiments/${exp.ideaName}.pdf`,
                        reviewScore: 6.0 + Math.random() * 2,
                        treeVisualization: "experiments/tree_viz.html",
                      }
                    : undefined,
              }
            : exp
        )
      );

      setSelectedExperiment((prev) =>
        prev?.id === expId
          ? {
              ...prev,
              progress,
              currentStage: stage,
              status: progress === 100 ? "completed" : "running",
            }
          : prev
      );

      stageIndex++;
      if (stageIndex < stages.length) {
        setTimeout(runNextStage, time);
      }
    };

    setTimeout(runNextStage, 1000);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="grid grid-cols-2 gap-3 border-b border-border bg-card/40 px-4 py-3 md:grid-cols-4 md:px-6">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-md border border-border bg-background/60 px-3 py-2">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <div className="mt-1 flex items-center gap-2">
                <Icon className={`h-4 w-4 ${stat.tone}`} />
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </section>

      <main className="flex-1 overflow-hidden">
        {activeTab === "ideas" && (
          <IdeasPanel
            ideas={mockIdeas}
            selectedIdea={selectedIdea}
            onSelectIdea={setSelectedIdea}
            onRunExperiment={handleRunExperiment}
          />
        )}

        {activeTab === "experiments" && (
          <ExperimentsPanel
            experiments={experiments}
            selectedExperiment={selectedExperiment}
            onSelectExperiment={setSelectedExperiment}
          />
        )}

        {activeTab === "configuration" && <ConfigurationPanel />}
        {activeTab === "logs" && <LogsPanel experiments={experiments} />}
        {activeTab === "papers" && <PapersPanel experiments={experiments} />}
      </main>

      {showRunModal && ideaToRun && (
        <RunExperimentModal
          idea={ideaToRun}
          onClose={() => {
            setShowRunModal(false);
            setIdeaToRun(null);
          }}
          onRun={handleStartExperiment}
        />
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 8);
}
