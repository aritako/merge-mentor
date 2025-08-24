import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { DiscordEmbedField } from './discord.types';
import { response } from 'express';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
  constructor(private readonly httpService: HttpService) { }


  assemblePayload(params: DiscordEmbedField) {
    const { repo, prNumber, prUrl, summary, suggestions, tests, learningTip, risk } = params;
    const payload = {
      content: '',
      embeds: [
        {
          title: `🔍 PR Review • ${repo} #${prNumber}`,
          url: prUrl,
          description: summary.slice(0, 3).map((s) => `• ${s}`).join('\n'),
          fields: [
            {
              name: '💡 Suggestions',
              value: suggestions.length
                ? suggestions.slice(0, 4).map((s) => `• ${s}`).join('\n')
                : 'None found. Nice work! 🎉',
            },
            {
              name: '🧪 Test Ideas',
              value: tests.length
                ? tests.slice(0, 3).map((t) => `• ${t}`).join('\n')
                : 'Consider adding at least one unit test.',
            },
            {
              name: '📘 Learning Tip',
              value: learningTip || 'Keep commits small and focused for easier reviews.',
            },
            {
              name: '⚠️ Risk',
              value: risk.toUpperCase(),
            },
          ],
          footer: { text: 'MergeMentor' },
        },
      ],
    };
    return payload;
  }

  async sendReviewEmbed(params: DiscordEmbedField) {
    const payload = this.assemblePayload(params);
    try {
      const response = await lastValueFrom(this.httpService.post(this.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      }))
    } catch (error) {
      this.logger.error(`Discord webhook failed: ${error}`);
      throw new Error(`Discord webhook failed: ${error}`);
    }

  }
}
