import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiAgentService {
  private openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  async reviewPR(title: string, body: string, diff: string) {
    const prompt = `
    You are MergeMentor, an AI-powered dev assistant for beginner developers, integrated with Discord.
    Your job is to review Pull Requests (PRs) and provide helpful, friendly feedback in simple language.

    For the PR below, please:
    1. Summarize what the PR does in beginner-friendly terms.
    2. Suggest possible test cases that should be added or improved.
    3. Point out any potential errors, bugs, or edge cases.
    4. Highlight any linting or style issues you notice.
    5. Offer constructive suggestions for improvement.

    Format your response as a Discord message, using bullet points and clear sections.

    PR Title: ${title}
    PR Body: ${body}
    Diff Snippet: ${diff}
    `
    const response = await this.openAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
  }


}
