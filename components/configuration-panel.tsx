"use client";

import { useState } from "react";
import {
  Settings,
  Cpu,
  GitBranch,
  FileCode,
  Sliders,
  Save,
  RotateCcw,
  Info,
} from "lucide-react";
import { availableModels } from "@/frontend/mock-data";
import { cn } from "@/frontend/utils";

interface ConfigurationPanelProps {
  onSave?: (config: ConfigState) => void;
}

interface ConfigState {
  // Experiment Models
  experimentModel: string;
  feedbackModel: string;
  // Writeup Models
  writeupModel: string;
  citationModel: string;
  reviewModel: string;
  aggPlotsModel: string;
  // Tree Search
  numWorkers: number;
  numDrafts: number;
  maxDebugDepth: number;
  debugProb: number;
  // Stages
  stage1MaxIters: number;
  stage2MaxIters: number;
  stage3MaxIters: number;
  stage4MaxIters: number;
  // Execution
  timeout: number;
  numSeeds: number;
  numCiteRounds: number;
  // Options
  writeupType: "normal" | "icbinb";
  loadCode: boolean;
  addDatasetRef: boolean;
  skipWriteup: boolean;
  skipReview: boolean;
}

const defaultConfig: ConfigState = {
  experimentModel: "anthropic.claude-3-5-sonnet-20241022-v2:0",
  feedbackModel: "gpt-4o-2024-11-20",
  writeupModel: "o1-preview-2024-09-12",
  citationModel: "gpt-4o-2024-11-20",
  reviewModel: "gpt-4o-2024-11-20",
  aggPlotsModel: "o3-mini-2025-01-31",
  numWorkers: 4,
  numDrafts: 3,
  maxDebugDepth: 3,
  debugProb: 0.5,
  stage1MaxIters: 20,
  stage2MaxIters: 12,
  stage3MaxIters: 12,
  stage4MaxIters: 18,
  timeout: 3600,
  numSeeds: 3,
  numCiteRounds: 20,
  writeupType: "icbinb",
  loadCode: false,
  addDatasetRef: true,
  skipWriteup: false,
  skipReview: false,
};

export function ConfigurationPanel({ onSave }: ConfigurationPanelProps) {
  const [config, setConfig] = useState<ConfigState>(defaultConfig);
  const [activeSection, setActiveSection] = useState("models");

  const updateConfig = <K extends keyof ConfigState>(
    key: K,
    value: ConfigState[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave?.(config);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
  };

  const sections = [
    { id: "models", label: "Models", icon: Cpu },
    { id: "treesearch", label: "Tree Search", icon: GitBranch },
    { id: "stages", label: "Stages", icon: Sliders },
    { id: "execution", label: "Execution", icon: FileCode },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-border">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Settings className="h-4 w-4 text-primary" />
          <h2 className="font-medium">Configuration</h2>
        </div>
        <nav className="p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                {sections.find((s) => s.id === activeSection)?.label}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure experiment parameters and model settings
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>

          {activeSection === "models" && (
            <div className="space-y-6">
              <ConfigSection title="Experiment Models" description="Models used during the experiment phase">
                <SelectField
                  label="Code Generation Model"
                  value={config.experimentModel}
                  onChange={(v) => updateConfig("experimentModel", v)}
                  options={availableModels.experiment}
                  hint="Model used for generating experiment code"
                />
                <SelectField
                  label="Feedback Model"
                  value={config.feedbackModel}
                  onChange={(v) => updateConfig("feedbackModel", v)}
                  options={availableModels.feedback}
                  hint="Model for evaluating output and tracebacks"
                />
              </ConfigSection>

              <ConfigSection title="Writeup Models" description="Models used during paper generation">
                <SelectField
                  label="Main Writeup Model"
                  value={config.writeupModel}
                  onChange={(v) => updateConfig("writeupModel", v)}
                  options={availableModels.writeup}
                  hint="Primary model for paper writing"
                />
                <SelectField
                  label="Citation Model"
                  value={config.citationModel}
                  onChange={(v) => updateConfig("citationModel", v)}
                  options={availableModels.citation}
                  hint="Model for gathering citations"
                />
                <SelectField
                  label="Review Model"
                  value={config.reviewModel}
                  onChange={(v) => updateConfig("reviewModel", v)}
                  options={availableModels.review}
                  hint="Model for paper review"
                />
                <SelectField
                  label="Plot Aggregation Model"
                  value={config.aggPlotsModel}
                  onChange={(v) => updateConfig("aggPlotsModel", v)}
                  options={availableModels.writeup}
                  hint="Model for aggregating experiment plots"
                />
              </ConfigSection>
            </div>
          )}

          {activeSection === "treesearch" && (
            <div className="space-y-6">
              <ConfigSection title="Search Parameters" description="Configure the best-first tree search algorithm">
                <NumberField
                  label="Number of Workers"
                  value={config.numWorkers}
                  onChange={(v) => updateConfig("numWorkers", v)}
                  min={1}
                  max={8}
                  hint="Parallel exploration paths"
                />
                <NumberField
                  label="Number of Drafts"
                  value={config.numDrafts}
                  onChange={(v) => updateConfig("numDrafts", v)}
                  min={1}
                  max={10}
                  hint="Initial root nodes (independent trees)"
                />
                <NumberField
                  label="Max Debug Depth"
                  value={config.maxDebugDepth}
                  onChange={(v) => updateConfig("maxDebugDepth", v)}
                  min={1}
                  max={10}
                  hint="Maximum debug attempts before abandoning"
                />
                <SliderField
                  label="Debug Probability"
                  value={config.debugProb}
                  onChange={(v) => updateConfig("debugProb", v)}
                  min={0}
                  max={1}
                  step={0.1}
                  hint="Probability of debugging a failing node"
                />
              </ConfigSection>
            </div>
          )}

          {activeSection === "stages" && (
            <div className="space-y-6">
              <ConfigSection title="Stage Iterations" description="Maximum iterations for each experiment stage">
                <NumberField
                  label="Stage 1 Max Iterations"
                  value={config.stage1MaxIters}
                  onChange={(v) => updateConfig("stage1MaxIters", v)}
                  min={1}
                  max={50}
                  hint="Initial exploration phase"
                />
                <NumberField
                  label="Stage 2 Max Iterations"
                  value={config.stage2MaxIters}
                  onChange={(v) => updateConfig("stage2MaxIters", v)}
                  min={1}
                  max={50}
                  hint="Deep exploration phase"
                />
                <NumberField
                  label="Stage 3 Max Iterations"
                  value={config.stage3MaxIters}
                  onChange={(v) => updateConfig("stage3MaxIters", v)}
                  min={1}
                  max={50}
                  hint="Refinement phase"
                />
                <NumberField
                  label="Stage 4 Max Iterations"
                  value={config.stage4MaxIters}
                  onChange={(v) => updateConfig("stage4MaxIters", v)}
                  min={1}
                  max={50}
                  hint="Final optimization phase"
                />
              </ConfigSection>
            </div>
          )}

          {activeSection === "execution" && (
            <div className="space-y-6">
              <ConfigSection title="Execution Settings" description="Runtime and output configuration">
                <NumberField
                  label="Timeout (seconds)"
                  value={config.timeout}
                  onChange={(v) => updateConfig("timeout", v)}
                  min={600}
                  max={7200}
                  step={300}
                  hint="Maximum time for code execution"
                />
                <NumberField
                  label="Number of Seeds"
                  value={config.numSeeds}
                  onChange={(v) => updateConfig("numSeeds", v)}
                  min={1}
                  max={10}
                  hint="Seeds for multi-seed evaluation"
                />
                <NumberField
                  label="Citation Rounds"
                  value={config.numCiteRounds}
                  onChange={(v) => updateConfig("numCiteRounds", v)}
                  min={5}
                  max={50}
                  hint="Rounds of citation gathering"
                />
              </ConfigSection>

              <ConfigSection title="Output Options" description="Paper and review generation settings">
                <SelectField
                  label="Writeup Type"
                  value={config.writeupType}
                  onChange={(v) => updateConfig("writeupType", v as "normal" | "icbinb")}
                  options={["normal", "icbinb"]}
                  optionLabels={{ normal: "Normal (8 pages)", icbinb: "ICBINB (4 pages)" }}
                  hint="Paper format and length"
                />
                <ToggleField
                  label="Load Code"
                  value={config.loadCode}
                  onChange={(v) => updateConfig("loadCode", v)}
                  hint="Initialize with code from idea file"
                />
                <ToggleField
                  label="Add Dataset Reference"
                  value={config.addDatasetRef}
                  onChange={(v) => updateConfig("addDatasetRef", v)}
                  hint="Include HuggingFace dataset reference"
                />
                <ToggleField
                  label="Skip Writeup"
                  value={config.skipWriteup}
                  onChange={(v) => updateConfig("skipWriteup", v)}
                  hint="Skip paper generation phase"
                />
                <ToggleField
                  label="Skip Review"
                  value={config.skipReview}
                  onChange={(v) => updateConfig("skipReview", v)}
                  hint="Skip paper review phase"
                />
              </ConfigSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfigSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-medium">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  optionLabels,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  optionLabels?: Record<string, string>;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div>
        <label className="text-sm font-medium">{label}</label>
        {hint && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            {hint}
          </p>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {optionLabels?.[opt] ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div>
        <label className="text-sm font-medium">{label}</label>
        {hint && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            {hint}
          </p>
        )}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-24 rounded-md border border-input bg-background px-3 py-1.5 text-right text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div>
        <label className="text-sm font-medium">{label}</label>
        {hint && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            {hint}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-32 accent-primary"
        />
        <span className="w-12 text-right font-mono text-sm">{value}</span>
      </div>
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div>
        <label className="text-sm font-medium">{label}</label>
        {hint && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            {hint}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          value ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            value && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
