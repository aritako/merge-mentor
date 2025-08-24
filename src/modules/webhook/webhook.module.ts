import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { DiscordModule } from '../discord/discord.module';
import { GithubService } from '../github/github.service';

@Module({
  imports: [AiAgentModule, DiscordModule],
  controllers: [WebhookController],
  providers: [WebhookService, GithubService]
})
export class WebhookModule { }
