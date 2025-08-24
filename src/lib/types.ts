export type GithubSignature = {
  secret: string;
  signatureHeader: string;
  rawBody: string;
}