import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordService {
  constructor(private readonly httpService: HttpService) { }

  sendMessage(content: string) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('DISCORD_WEBHOOK_URL environment variable is not set.');
    }
    this.httpService.post(webhookUrl, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  }
}
