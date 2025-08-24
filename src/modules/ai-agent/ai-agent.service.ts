import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AiAgentReviewInput, AiAgentReviewOutput } from './ai-agent.types';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  async reviewPR(input: AiAgentReviewInput) {
    const { repo, prNumber, title, body, changedFilesSample } = input;
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
      ${changedFilesSample || '(no diff available)'}
    `.trim();

    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: system },
        { role: "system", content: user }
      ],
      response_format: { type: 'json_object' } as any
    });

    const text = response.choices[0]?.message?.content ?? '{}';
    try {
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
      return {
        summary: ['Could not parse review output.'],
        suggestions: [],
        tests: [],
        learning_tip: 'Keep PRs small and focused to make reviews easier.',
        risk: 'low',
      };
    }
  }


}
