import { AiAgentRiskLevels } from "../ai-agent/ai-agent.types";

export interface DiscordEmbedField {
  repo: string;
  prNumber: number;
  prUrl: string;
  summary: string[];
  suggestions: string[];
  tests: string[];
  learningTip: string;
  risk: AiAgentRiskLevels;
}

export interface DiscordMessagePayload {
  content: string;
  embeds: DiscordEmbed[];
}

export interface DiscordEmbed {
  title: string;
  url: string;
  description: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string; icon_url?: string };
}