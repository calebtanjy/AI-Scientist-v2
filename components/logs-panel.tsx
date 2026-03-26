"use client";

import { useState, useRef, useEffect } from "react";
import {
  Terminal,
  Search,
  Download,
  Trash2,
  ChevronDown,
  Filter,
} from "lucide-react";
import type { ExperimentRun } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LogsPanelProps {
  experiments: ExperimentRun[];
}

type LogLevel = "all" | "info" | "warning" | "error";

export function LogsPanel({ experiments }: LogsPanelProps) {
  const [selectedExperiment, setSelectedExperiment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [logLevel, setLogLevel] = useState<LogLevel>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Combine all logs with experiment info
  const allLogs = experiments.flatMap((exp) =>
    exp.logs.map((log, idx) => ({
      id: `${exp.id}-${idx}`,
      experimentId: exp.id,
      experimentName: exp.ideaName,
      message: log,
      level: getLogLevel(log),
      timestamp: extractTimestamp(log),
    }))
  );

  // Filter logs
  const filteredLogs = allLogs.filter((log) => {
    if (selectedExperiment !== "all" && log.experimentId !== selectedExperiment)
      return false;
    if (logLevel !== "all" && log.level !== logLevel) return false;
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs.length, autoScroll]);

  const handleDownload = () => {
    const content = filteredLogs.map((log) => log.message).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-accent" />
          <h2 className="font-medium">Execution Logs</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {filteredLogs.length} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-1.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Experiment Filter */}
        <div className="relative">
          <select
            value={selectedExperiment}
            onChange={(e) => setSelectedExperiment(e.target.value)}
            className="appearance-none rounded-md border border-input bg-background py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Experiments</option>
            {experiments.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.ideaName.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1 rounded-md border border-input p-1">
          {(["all", "info", "warning", "error"] as LogLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setLogLevel(level)}
              className={cn(
                "rounded px-2 py-1 text-xs font-medium capitalize transition-colors",
                logLevel === level
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Auto-scroll toggle */}
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-muted-foreground">Auto-scroll</span>
        </label>
      </div>

      {/* Logs Content */}
      <div className="flex-1 overflow-y-auto bg-muted/30 p-4">
        {filteredLogs.length > 0 ? (
          <div className="space-y-1 font-mono text-sm">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "flex gap-3 rounded px-2 py-1 transition-colors hover:bg-secondary/50",
                  log.level === "error" && "bg-destructive/10 text-destructive",
                  log.level === "warning" && "bg-warning/10 text-warning"
                )}
              >
                <span className="shrink-0 text-muted-foreground">
                  {log.timestamp}
                </span>
                <span
                  className={cn(
                    "w-16 shrink-0 truncate text-xs",
                    log.level === "error" && "text-destructive",
                    log.level === "warning" && "text-warning",
                    log.level === "info" && "text-muted-foreground"
                  )}
                >
                  [{log.experimentName.slice(0, 12)}]
                </span>
                <span className="flex-1 break-all">
                  {log.message.replace(/^\[\d{2}:\d{2}:\d{2}\]\s*/, "")}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Terminal className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">No logs to display</p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Run an experiment to see execution logs
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getLogLevel(message: string): LogLevel {
  const lower = message.toLowerCase();
  if (lower.includes("error") || lower.includes("fail")) return "error";
  if (lower.includes("warning") || lower.includes("warn")) return "warning";
  return "info";
}

function extractTimestamp(message: string): string {
  const match = message.match(/^\[(\d{2}:\d{2}:\d{2})\]/);
  return match ? match[1] : "--:--:--";
}
