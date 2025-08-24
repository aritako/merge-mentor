import { Injectable } from '@nestjs/common';
import { DiscordService } from '../discord/discord.service';
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { GithubService } from '../github/github.service';
import { DiscordEmbedField } from '../discord/discord.types';
@Injectable()
export class WebhookService {
  constructor(
    private readonly aiAgent: AiAgentService,
    private readonly discord: DiscordService,
    private readonly github: GithubService,
  ) { }

  async processPullRequest(payload: any) {
    const action = payload.action;
    const allowed = ['opened', 'edited', 'synchronize', 'reopened'];
    if (!allowed.includes(action)) return;

    const pr = payload.pull_request;
    const repoFullName = payload.repository.full_name as string;
    const prNumber = pr.number as number;
    const title = pr.title as string;
    const body = (pr.body as string) || '';
    const prUrl = pr.html_url as string;

    // get diff files
    const files = await this.github.getPullFiles({ repoFullName, prNumber });
    const diffSample = this.github.buildDiffSample(files);

    // AI review
    const review = await this.aiAgent.reviewPR({
      repo: repoFullName,
      prNumber,
      title,
      body,
      changedFilesSample: diffSample,
    });

    await this.discord.sendReviewEmbed({
      repo: repoFullName,
      prNumber,
      prUrl,
      summary: review.summary || [],
      suggestions: review.suggestions || [],
      tests: review.tests || [],
      learningTip: review.learning_tip || '',
      risk: (review.risk ?? "low") as DiscordEmbedField['risk'],
    });
  }
}
