import { Injectable } from '@nestjs/common';
import { GithubPullFilesRequest, GithubPullFilesResponse } from './github.types';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { response } from 'express';
@Injectable()
export class GithubService {
  private readonly token = process.env.GITHUB_TOKEN;
  constructor(private readonly httpService: HttpService) { }

  async getPullFiles(params: GithubPullFilesRequest): Promise<GithubPullFilesResponse[]> {
    const { repo, prNumber } = params
    const url = `https://api.github.com/repos/${repo}/pulls/${prNumber}/files?per_page=100`
    try {
      const response = await lastValueFrom(this.httpService.get(url,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
          }
        }
      ));
      return response.data as GithubPullFilesResponse[];
    } catch (error) {
      throw new Error(`GitHub API error (${response.statusCode}): ${response.statusMessage}`);
    }
  }

  buildDiffSample(files: GithubPullFilesResponse[]): string {
    const maxChars = 10000;
    let out = '';
    for (const f of files.slice(0, 8)) {
      if (!f.patch) continue;
      const header = `--- ${f.filename}\n`;
      if ((out.length + header.length) > maxChars) break;
      out += header;
      const remaining = maxChars - out.length;
      out += f.patch.slice(0, remaining);
      out += '\n\n';
      if (out.length >= maxChars) break;
    }
    return out.trim();
  }
}