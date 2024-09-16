import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { GitHubRepository, GitHubPullRequest, GitHubPullRequestFile } from '@shared/models/github';
import { AuthService } from '@shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  apiBase: string = 'https://api.github.com';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    // Only add Authorization header if AuthService indicates GitHub is connected
    if (this.authService.hasGithub()) {
      const token = this.authService.getOauthToken();
      if (token && token.trim() !== '') {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  getGitHubRepositories(): Observable<GitHubRepository[]> {
      const headers = this.createHeaders();
      return this.http.get<GitHubRepository[]>(`${this.apiBase}/user/repos?per_page=100&type=all`, { headers })
  }

  getPullRequests(owner: string, repo: string): Observable<GitHubPullRequest[]> {
    const headers = this.createHeaders();
    return this.http.get<GitHubPullRequest[]>(`${this.apiBase}/repos/${owner}/${repo}/pulls`, { headers });
  }

  getPullRequestFiles(owner: string, repo: string, pullNumber: number): Observable<GitHubPullRequestFile[]> {
    const headers = this.createHeaders();
    return this.http.get<GitHubPullRequestFile[]>(`${this.apiBase}/repos/${owner}/${repo}/pulls/${pullNumber}/files`, { headers });
  }

  getPullRequestDetails(owner: string, repo: string, pullNumber: number): Observable<GitHubPullRequest> {
    const headers = this.createHeaders();
    return this.http.get<GitHubPullRequest>(`${this.apiBase}/repos/${owner}/${repo}/pulls/${pullNumber}`, { headers });
  }
}
