import { Injectable } from '@nestjs/common';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly aiAgent: AiAgentService,
    private readonly discord: DiscordService,
  ) { }

  async processPullRequest(payload: any) {
    const title = payload.pull_request.title;
    const body = payload.pull_request.body;
    const diff = '(TODO: fetch diff from GitHub API)';

    const review = await this.aiAgent.reviewPR(title, body, diff);
    await this.discord.sendMessage(`🛠️ New PR Review:\n${review}`);
  }
}
