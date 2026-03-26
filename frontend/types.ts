export type NavigationTab =
  | "ideas"
  | "experiments"
  | "configuration"
  | "logs"
  | "papers";

export interface ResearchIdea {
  Name: string;
  Title: string;
  "Short Hypothesis": string;
  Abstract: string;
  "Related Work": string;
  Experiments: string[];
  "Risk Factors and Limitations": string[] | string;
  Code?: string;
}

export type ExperimentStatus = "idle" | "running" | "completed" | "failed";

export interface ExperimentResults {
  paperPath?: string;
  reviewScore?: number;
  treeVisualization?: string;
}

export interface ExperimentRun {
  id: string;
  ideaName: string;
  status: ExperimentStatus;
  progress: number;
  currentStage: string;
  startTime?: string;
  endTime?: string;
  logs: string[];
  results?: ExperimentResults;
}
