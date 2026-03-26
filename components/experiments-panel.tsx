"use client";

import {
  FlaskConical,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  FileText,
  TreeDeciduous,
  RefreshCw,
} from "lucide-react";
import type { ExperimentRun } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExperimentsPanelProps {
  experiments: ExperimentRun[];
  selectedExperiment: ExperimentRun | null;
  onSelectExperiment: (exp: ExperimentRun) => void;
}

const statusConfig = {
  idle: {
    icon: Clock,
    label: "Idle",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  running: {
    icon: RefreshCw,
    label: "Running",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export function ExperimentsPanel({
  experiments,
  selectedExperiment,
  onSelectExperiment,
}: ExperimentsPanelProps) {
  return (
    <div className="flex h-full">
      {/* Experiments List */}
      <div className="w-80 shrink-0 border-r border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-accent" />
            <h2 className="font-medium">Experiments</h2>
          </div>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {experiments.length}
          </span>
        </div>

        <div className="overflow-y-auto">
          {experiments.map((exp) => {
            const status = statusConfig[exp.status];
            const StatusIcon = status.icon;

            return (
              <button
                key={exp.id}
                onClick={() => onSelectExperiment(exp)}
                className={cn(
                  "w-full border-b border-border p-4 text-left transition-colors",
                  selectedExperiment?.id === exp.id
                    ? "bg-secondary"
                    : "hover:bg-secondary/50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          status.color,
                          exp.status === "running" && "animate-spin"
                        )}
                      />
                      <span className="truncate text-sm font-medium">
                        {exp.ideaName.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {exp.currentStage}
                    </p>
                    {exp.status === "running" && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-mono text-primary">
                            {exp.progress}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${exp.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experiment Details */}
      <div className="flex-1 overflow-y-auto">
        {selectedExperiment ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold">
                    {selectedExperiment.ideaName.replace(/_/g, " ")}
                  </h1>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">
                    {selectedExperiment.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedExperiment.status === "idle" && (
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                      <Play className="h-4 w-4" />
                      Start
                    </button>
                  )}
                  {selectedExperiment.status === "running" && (
                    <button className="flex items-center gap-2 rounded-lg bg-warning px-4 py-2 text-sm font-medium text-warning-foreground transition-colors hover:bg-warning/90">
                      <Pause className="h-4 w-4" />
                      Pause
                    </button>
                  )}
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={cn(
                  "mt-4 flex items-center gap-3 rounded-lg p-4",
                  statusConfig[selectedExperiment.status].bg
                )}
              >
                {(() => {
                  const StatusIcon =
                    statusConfig[selectedExperiment.status].icon;
                  return (
                    <StatusIcon
                      className={cn(
                        "h-5 w-5",
                        statusConfig[selectedExperiment.status].color,
                        selectedExperiment.status === "running" && "animate-spin"
                      )}
                    />
                  );
                })()}
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      statusConfig[selectedExperiment.status].color
                    )}
                  >
                    {statusConfig[selectedExperiment.status].label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedExperiment.currentStage}
                  </p>
                </div>
                {selectedExperiment.status === "running" && (
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-primary">
                      {selectedExperiment.progress}%
                    </p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                )}
              </div>
            </div>

            {/* Time Info */}
            {(selectedExperiment.startTime || selectedExperiment.endTime) && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                {selectedExperiment.startTime && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Started</p>
                    <p className="mt-1 font-mono text-sm">
                      {new Date(selectedExperiment.startTime).toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedExperiment.endTime && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="mt-1 font-mono text-sm">
                      {new Date(selectedExperiment.endTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {selectedExperiment.results && (
              <div className="mb-6">
                <h3 className="mb-3 font-medium">Results</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedExperiment.results.paperPath && (
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Generated Paper</p>
                        <p className="truncate text-xs text-muted-foreground">
                          PDF Available
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )}
                  {selectedExperiment.results.treeVisualization && (
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary"
                    >
                      <TreeDeciduous className="h-5 w-5 text-accent" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Tree Visualization</p>
                        <p className="truncate text-xs text-muted-foreground">
                          Interactive HTML
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )}
                  {selectedExperiment.results.reviewScore !== undefined && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                        <span className="text-lg font-bold text-accent">
                          {selectedExperiment.results.reviewScore}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Review Score</p>
                        <p className="text-xs text-muted-foreground">
                          Out of 10
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Logs */}
            {selectedExperiment.logs.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium">Execution Logs</h3>
                <div className="max-h-80 overflow-y-auto rounded-lg border border-border bg-muted p-4">
                  <pre className="font-mono text-xs leading-relaxed text-foreground/80">
                    {selectedExperiment.logs.join("\n")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FlaskConical className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                Select an experiment to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
