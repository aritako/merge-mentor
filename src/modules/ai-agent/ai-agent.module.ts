import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.AI_AGENT_BASE_URL,
      timeout: 10000,
    })
  ],
  providers: [AiAgentService],
  exports: [AiAgentService]
})
export class AiAgentModule { }
