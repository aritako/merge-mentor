import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AiAgentReviewInput, AiAgentReviewOutput } from './ai-agent.types';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly baseURL = process.env.AI_AGENT_BASE_URL;
  private readonly aiModel = process.env.AI_MODEL || 'qwen3-4b-thinking-2507';
  constructor(private readonly httpService: HttpService) { }

  async reviewPR(input: AiAgentReviewInput): Promise<AiAgentReviewOutput> {
    const { repo, prNumber, title, body, diffSample } = input;
    const system = `
      You are MergeMentor, an AI-powered dev assistant for beginner developers, integrated with Discord.
      Your job is to review Pull Requests (PRs) and provide helpful, friendly feedback in simple language.

      For the PR below, please:
      1. Summarize what the PR does in beginner-friendly terms.
      2. Suggest possible test cases that should be added or improved.
      3. Point out any potential errors, bugs, or edge cases.
      4. Highlight any linting or style issues you notice.
      5. Offer constructive suggestions for improvement.

      Output STRICTLY valid JSON with keys:
      - summary (array, max 3), suggestions (array, max 4), tests (array, max 3), learning_tip (string), risk ("low"|"medium"|"high").
    `.trim();

    const user = `
      Repo: ${repo}
      PR #${prNumber}
      Title: ${title}
      Body: ${body || '(no description)'}
      Diff Sample (unified):
      ${diffSample || '(no diff available)'}
    `.trim();

    try {
      const response = await lastValueFrom(
        this.httpService.post('/chat/completions', {
          model: 'qwen2.5-7b-instruct',
          messages: [
            { role: 'system', content: 'You are a helpful coding mentor.' },
            { role: 'user', content: prompt },
          ],
        }).pipe(
          catchError((error) => {
            this.logger.error('Error occurred while calling AI API', error);
            throw new Error('AI API call failed');
          })
        )
      );


      const text = response.data?.choices?.[0]?.message?.content ?? '{}';
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


}
