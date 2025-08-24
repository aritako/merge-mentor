import { Controller, Post, Req, Res, Headers, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { WebhookService } from './webhook.service';
import { verifyGithubSignature } from 'src/lib/verify';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Post('github')
  async handleGithubWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-github-event') event: string,
    @Headers('x-hub-signature-256') signature: string,
  ) {
    try {
      const secret = process.env.GITHUB_WEBHOOK_SECRET!;
      const rawBody = req.body // Raw

      // 1) Verify signature
      const ok = verifyGithubSignature({ secret, signatureHeader: signature, rawBody });
      if (!ok) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid signature' });
      }

      // 2) Parse JSON safely after verifying
      const payload = JSON.parse(rawBody.toString('utf8'));

      // 3) Filter event
      if (event === 'pull_request') {
        await this.webhookService.processPullRequest(payload);
      }

      return res.json({ status: 'ok' });
    } catch (e: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message || 'error' });
    }
  }
}
