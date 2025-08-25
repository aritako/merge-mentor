import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { HttpModule } from '@nestjs/axios';
import { AiAgentController } from './ai-agent.controller';

@Module({
  imports: [
    HttpModule

  ],
  providers: [AiAgentService],
  exports: [AiAgentService],
  controllers: [AiAgentController]
})
export class AiAgentModule { }
