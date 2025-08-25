import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { DiscordModule } from '../discord/discord.module';
import { GithubModule } from '../github/github.module';

@Module({
  imports: [GithubModule, AiAgentModule, DiscordModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule { }
