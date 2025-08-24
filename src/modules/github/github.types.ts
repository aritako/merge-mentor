export type GithubPullFilesRequest = {
  repoFullName: string;
  prNumber: number;
}

export type GithubPullFilesResponse = {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}