export interface ResearchArtifact {
  title: string
  date: string
  kind: "paper" | "post" | "release"
}

export const recentResearch: ResearchArtifact[] = [
  { title: "Deliberative Agents at Scale", date: "Mar 2026", kind: "paper" },
  { title: "Sparse Mixtures for Efficient Reasoning", date: "Feb 2026", kind: "paper" },
  { title: "Value Learning under Distribution Shift", date: "Feb 2026", kind: "paper" },
  { title: "M3 System Card", date: "Jan 2026", kind: "release" },
  { title: "Long-Context Evaluation Suite v2", date: "Jan 2026", kind: "post" },
  { title: "Tool-Use Reliability on Real APIs", date: "Dec 2025", kind: "paper" },
  { title: "Self-Consistency without Sampling Cost", date: "Nov 2025", kind: "paper" },
]