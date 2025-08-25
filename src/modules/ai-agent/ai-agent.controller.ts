import { Body, Controller, Post } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';

@Controller('ai-agent')
export class AiAgentController {

  constructor(private readonly aiAgentService: AiAgentService) { }
  @Post('chat')
  async chat(@Body('message') message: string) {
    return { reply: await this.aiAgentService.chat(message) };
  }
}
