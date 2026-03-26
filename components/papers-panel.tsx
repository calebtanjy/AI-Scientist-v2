"use client";

import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Award,
  Eye,
} from "lucide-react";
import type { ExperimentRun } from "@/frontend/types";
import { cn } from "@/frontend/utils";

interface PapersPanelProps {
  experiments: ExperimentRun[];
}

export function PapersPanel({ experiments }: PapersPanelProps) {
  const completedExperiments = experiments.filter(
    (exp) => exp.status === "completed" && exp.results?.paperPath
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h2 className="font-medium">Generated Papers</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {completedExperiments.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {completedExperiments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedExperiments.map((exp) => (
              <PaperCard key={exp.id} experiment={exp} />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">No papers generated yet</p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Complete an experiment to generate a research paper
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaperCard({ experiment }: { experiment: ExperimentRun }) {
  const score = experiment.results?.reviewScore;

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50">
      {/* Preview Area */}
      <div className="relative aspect-[3/4] bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText className="h-16 w-16 text-muted-foreground/20" />
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Eye className="h-4 w-4" />
            View
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
        {/* Score Badge */}
        {score !== undefined && (
          <div className="absolute right-2 top-2">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                score >= 7
                  ? "bg-accent/90 text-accent-foreground"
                  : score >= 5
                    ? "bg-warning/90 text-warning-foreground"
                    : "bg-destructive/90 text-destructive-foreground"
              )}
            >
              <Award className="h-3 w-3" />
              {score}/10
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="truncate font-medium">
          {experiment.ideaName.replace(/_/g, " ")}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          Autonomous research paper generated via agentic tree search
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {experiment.endTime
              ? new Date(experiment.endTime).toLocaleDateString()
              : "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            PDF
          </span>
        </div>
      </div>
    </div>
  );
}
