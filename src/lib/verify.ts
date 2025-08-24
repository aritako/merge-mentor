import { createHmac, timingSafeEqual } from 'crypto'
import { GithubSignature } from './types';

export function verifyGithubSignature({ secret, signatureHeader, rawBody }: GithubSignature) {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) return false;
  const theirSig = Buffer.from(signatureHeader.replace('sha256=', ''), 'hex');
  const hmac = createHmac('sha256', secret);
  hmac.update(rawBody);
  const ourSig = Buffer.from(hmac.digest('hex'), 'hex');
  try {
    return timingSafeEqual(ourSig, theirSig);
  } catch {
    return false;
  }
}