import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './modules/webhook/webhook.module';
import { AiAgentModule } from './modules/ai-agent/ai-agent.module';
import { DiscordModule } from './modules/discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from './modules/github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WebhookModule, AiAgentModule, DiscordModule, GithubModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
