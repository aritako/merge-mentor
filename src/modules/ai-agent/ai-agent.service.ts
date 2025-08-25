import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AiAgentReviewInput, AiAgentReviewOutput } from './ai-agent.types';
import { getSystemPrompt, getUserPrompt } from './ai-agent.prompt';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AiAgentService {
  private readonly baseURL = process.env.AI_AGENT_BASE_URL;
  private readonly logger = new Logger(AiAgentService.name);
  private readonly aiModel = process.env.AI_MODEL || 'qwen3-4b-thinking-2507';
  private readonly client = new OpenAI({
    baseURL: this.baseURL,
    apiKey: 'lm-studio',
  });

  constructor(private readonly httpService: HttpService) { }

  async reviewPR(input: AiAgentReviewInput): Promise<AiAgentReviewOutput> {
    const { repo, prNumber, title, body, diffSample } = input;
    const system = getSystemPrompt();
    const user = getUserPrompt(repo, prNumber, title, body, diffSample);

    try {
      const response = await this.client.chat.completions.create({
        model: this.aiModel,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        response_format: { type: 'json_object' } as any,
      });

      const text = response.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(text) as AiAgentReviewOutput;
      return {
        summary: parsed.summary?.slice(0, 3) || [],
        suggestions: parsed.suggestions?.slice(0, 4) || [],
        tests: parsed.tests?.slice(0, 3) || [],
        learning_tip: parsed.learning_tip || 'Write tests for success and failure paths.',
        risk: (parsed.risk || 'low') as AiAgentReviewOutput['risk'],
      };
    } catch (e) {
      this.logger.warn('AI JSON parse failed; falling back to safe defaults.');
      return this.safeDefaults();
    }
  }

  private safeDefaults(): AiAgentReviewOutput {
    return {
      summary: ['AI review unavailable.'],
      suggestions: [],
      tests: [],
      learning_tip: 'Keep PRs small and focused.',
      risk: 'low',
    };
  }

  async chat(prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.aiModel,
        messages: [
          { role: 'user', content: prompt },
        ],
      });
      return response.choices[0]?.message?.content ?? '';
    } catch (e) {
      this.logger.warn('AI Chat Failed: ' + e.message);
      throw new Error('AI Chat Failed: ' + e.message);
    }
  }
}
