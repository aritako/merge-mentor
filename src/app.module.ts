import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './modules/webhook/webhook.module';
import { AiAgentModule } from './modules/ai-agent/ai-agent.module';
import { DiscordModule } from './modules/discord/discord.module';

@Module({
  imports: [WebhookModule, AiAgentModule, DiscordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
