import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Post('github')
  async handleGithubWebhook(
    @Headers('x-github-event') event: string,
    @Body() payload: any,
  ) {
    switch (event) {
      case 'pull_request':
        if (['opened', 'edited', 'synchronize'].includes(payload.action)) {
          return this.webhookService.processPullRequest(payload);
        }
      default:
        return { status: 'ok' }
    }
  }
}
