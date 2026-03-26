import type { ExperimentRun, ResearchIdea } from "@/frontend/types";

export const availableModels = {
  experiment: [
    "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "gpt-4o-2024-11-20",
    "o3-mini-2025-01-31",
  ],
  feedback: ["gpt-4o-2024-11-20", "gpt-4.1-2025-04-14"],
  writeup: ["o1-preview-2024-09-12", "gpt-4o-2024-11-20", "o3-mini-2025-01-31"],
  citation: ["gpt-4o-2024-11-20", "gpt-4.1-mini-2025-04-14"],
  review: ["gpt-4o-2024-11-20", "o3-mini-2025-01-31"],
} as const;

export const mockIdeas: ResearchIdea[] = [
  {
    Name: "agentic_data_curriculum",
    Title: "Curriculum-driven data selection for autonomous experiment agents",
    "Short Hypothesis":
      "A dynamic curriculum that reorders dataset slices by uncertainty will improve experiment success rate and reduce total compute.",
    Abstract:
      "We propose an agentic curriculum policy that continuously reprioritizes data slices during iterative experimentation. The planner agent uses recent error traces and model uncertainty to focus on informative samples first, aiming to improve convergence and robustness.",
    "Related Work":
      "Connects to active learning, self-paced learning, and multi-armed bandit scheduling. Unlike static curricula, this method is controlled by feedback loops from autonomous agents.",
    Experiments: [
      "Compare static, random, and curriculum-driven sampling on benchmark tabular tasks.",
      "Measure convergence speed, final accuracy, and number of failed runs.",
      "Ablate uncertainty signals used by the curriculum policy.",
    ],
    "Risk Factors and Limitations": [
      "Curriculum policy may overfit to noisy uncertainty estimates.",
      "More scheduling logic can increase orchestration complexity.",
    ],
    Code: "def build_curriculum_scheduler(...): pass",
  },
  {
    Name: "tree_search_reflection_cache",
    Title: "Reflection memory cache for best-first tree search",
    "Short Hypothesis":
      "Caching reusable debug reflections across sibling nodes will reduce duplicate failures and improve throughput.",
    Abstract:
      "This idea introduces a structured cache keyed by failure signatures and context embeddings. During tree expansion, agents can retrieve previously successful fixes and adapt them to new nodes.",
    "Related Work":
      "Builds on retrieval-augmented generation and program repair memories, but focuses on reuse inside evolving research trees.",
    Experiments: [
      "Benchmark run-time and success rate with/without reflection cache.",
      "Evaluate cache hit quality via manual and automatic grading.",
    ],
    "Risk Factors and Limitations":
      "Incorrectly reused reflections could propagate bad assumptions and reduce exploration diversity.",
  },
  {
    Name: "multi_agent_plot_critic",
    Title: "Plot-critic specialist agents for improved paper quality",
    "Short Hypothesis":
      "Specialist critic agents focused on visualization quality will improve final review scores of generated papers.",
    Abstract:
      "We assign dedicated critics for figure readability, statistical validity, and narrative consistency. Their feedback is integrated before the final writeup stage.",
    "Related Work":
      "Related to multi-agent debate and automated data visualization linting.",
    Experiments: [
      "Compare review scores with and without plot critics.",
      "Measure additional token cost and latency overhead.",
      "Analyze error categories fixed by critic agents.",
    ],
    "Risk Factors and Limitations": [
      "Higher token usage may offset quality gains.",
      "Critic disagreements can create conflicting guidance.",
    ],
  },
];

export const mockExperimentRuns: ExperimentRun[] = [
  {
    id: "exp-20260320-01",
    ideaName: "tree_search_reflection_cache",
    status: "completed",
    progress: 100,
    currentStage: "Complete!",
    startTime: "2026-03-20T08:02:00.000Z",
    endTime: "2026-03-20T09:10:00.000Z",
    logs: [
      "[08:02:12] Starting experiment pipeline...",
      "[08:04:30] Stage 1: Initializing tree search...",
      "[08:55:10] Generating paper writeup...",
      "[09:10:02] Complete!",
    ],
    results: {
      paperPath: "experiments/20260320_tree_search_reflection_cache.pdf",
      reviewScore: 7.4,
      treeVisualization: "experiments/20260320_tree_viz.html",
    },
  },
  {
    id: "exp-20260325-01",
    ideaName: "multi_agent_plot_critic",
    status: "running",
    progress: 42,
    currentStage: "Stage 2: Evaluating candidates...",
    startTime: "2026-03-25T12:15:00.000Z",
    logs: [
      "[12:15:01] Starting experiment pipeline...",
      "[12:16:18] Stage 1: Exploring initial nodes...",
      "[12:35:44] Stage 2: Evaluating candidates...",
    ],
  },
];
