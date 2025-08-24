export type AiAgentReviewOutput = {
  summary: string[];
  suggestions: string[];
  tests: string[];
  learning_tip: string;
  risk: 'low' | 'medium' | 'high';
}

export type AiAgentReviewInput = {
  repo: string;
  prNumber: number;
  title: string;
  body: string;
  changedFilesSample: string;
}