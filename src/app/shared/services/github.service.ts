import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  apiBase: string = 'https://api.github.com';

  constructor(private http: HttpClient) { }

  private createHeaders(token: string | null): HttpHeaders {
    let headers = new HttpHeaders();
    if (token && token.trim() !== '') {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getGitHubRepositories(token: string | null | '') {
    const headers = this.createHeaders(token);
    return this.http.get(`${this.apiBase}/user/repos?per_page=100&type=all`, { headers });
  }

  getPullRequests(token: string | null | '', owner: string, repo: string) {
    const headers = this.createHeaders(token);
    return this.http.get(`${this.apiBase}/repos/${owner}/${repo}/pulls`, { headers });
  }

  getPullRequestFiles(token: string | null | '', owner: string, repo: string, pullNumber: number) {
    const headers = this.createHeaders(token);
    return this.http.get(`${this.apiBase}/repos/${owner}/${repo}/pulls/${pullNumber}/files`, { headers });
  }

  getPullRequestDetails(token: string | null | '', owner: string, repo: string, pullNumber: number) {
    const headers = this.createHeaders(token);
    return this.http.get(`${this.apiBase}/repos/${owner}/${repo}/pulls/${pullNumber}`, { headers });
  }
}
