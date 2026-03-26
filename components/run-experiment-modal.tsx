"use client";

import { useState } from "react";
import { X, Play, Cpu, GitBranch, FileCode, AlertCircle } from "lucide-react";
import type { ResearchIdea } from "@/lib/types";
import { availableModels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface RunExperimentModalProps {
  idea: ResearchIdea;
  onClose: () => void;
  onRun: (config: RunConfig) => void;
}

interface RunConfig {
  experimentModel: string;
  writeupType: "normal" | "icbinb";
  loadCode: boolean;
  skipWriteup: boolean;
}

export function RunExperimentModal({
  idea,
  onClose,
  onRun,
}: RunExperimentModalProps) {
  const [config, setConfig] = useState<RunConfig>({
    experimentModel: availableModels.experiment[0],
    writeupType: "icbinb",
    loadCode: !!idea.Code,
    skipWriteup: false,
  });

  const handleRun = () => {
    onRun(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Run Experiment</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Configure and start the experiment pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Idea Summary */}
          <div className="mb-6 rounded-lg bg-secondary/50 p-4">
            <p className="text-sm font-medium">{idea.Name.replace(/_/g, " ")}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {idea["Short Hypothesis"]}
            </p>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            {/* Model Selection */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Cpu className="h-4 w-4 text-primary" />
                Experiment Model
              </label>
              <select
                value={config.experimentModel}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    experimentModel: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {availableModels.experiment.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Writeup Type */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <FileCode className="h-4 w-4 text-accent" />
                Paper Format
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, writeupType: "icbinb" }))
                  }
                  className={cn(
                    "flex-1 rounded-md border px-4 py-2 text-sm transition-colors",
                    config.writeupType === "icbinb"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-secondary"
                  )}
                >
                  ICBINB (4 pages)
                </button>
                <button
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, writeupType: "normal" }))
                  }
                  className={cn(
                    "flex-1 rounded-md border px-4 py-2 text-sm transition-colors",
                    config.writeupType === "normal"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-secondary"
                  )}
                >
                  Normal (8 pages)
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-md border border-border p-3 transition-colors hover:bg-secondary/50">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Load Starter Code</p>
                    <p className="text-xs text-muted-foreground">
                      Initialize with code from idea file
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.loadCode}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, loadCode: e.target.checked }))
                  }
                  disabled={!idea.Code}
                  className="h-4 w-4 rounded border-input accent-primary disabled:opacity-50"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-md border border-border p-3 transition-colors hover:bg-secondary/50">
                <div className="flex items-center gap-3">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Skip Paper Writeup</p>
                    <p className="text-xs text-muted-foreground">
                      Only run experiments, no paper generation
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.skipWriteup}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      skipWriteup: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-input accent-primary"
                />
              </label>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 rounded-md bg-warning/10 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <p className="text-sm font-medium text-warning">Heads up</p>
                <p className="text-xs text-warning/80">
                  Running experiments will execute LLM-generated code. Ensure
                  you&apos;re in a sandboxed environment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play className="h-4 w-4" />
            Start Experiment
          </button>
        </div>
      </div>
    </div>
  );
}
