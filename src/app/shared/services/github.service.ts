import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, filter, forkJoin, map, of, shareReplay, switchMap, throwError } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { GitHubRepository, GitHubPullRequest, GitHubPullRequestFile } from '@shared/models/github';
import { AuthService } from '@shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  apiBase: string = 'https://api.github.com';
  http = inject(HttpClient);

  constructor(private authService: AuthService) { }

  headers = this.createHeaders();

  //expose observables as private so that they can only be subscribed here by our signals.
  //repositories
  private repositories$ = this.http.get<GitHubRepository[]>(`${this.apiBase}/user/repos?per_page=100&type=all`, { headers: this.headers }).pipe(
    shareReplay(1),
    catchError(this.handleError)
  );
  repositories = toSignal(this.repositories$, { initialValue: [] as GitHubRepository[] });
  selectedRepository = signal<GitHubRepository | undefined>(undefined);

  //pull requests
  private pullRequests$ = toObservable(this.selectedRepository).pipe(
    filter(Boolean),
    switchMap(repo =>
      this.http.get<GitHubPullRequest[]>(`${this.apiBase}/repos/${repo.owner}/${repo.name}/pulls`, { headers: this.headers }
      )
    ));
  pullRequests = toSignal(this.pullRequests$, { initialValue: [] as GitHubPullRequest[] });
  selectedPullRequest = signal<GitHubPullRequest | undefined>(undefined);

  //pull request files
  private pullRequestFiles$ = toObservable(this.selectedPullRequest).pipe(
    filter(Boolean),
    switchMap(pull =>
      this.http.get<GitHubPullRequestFile[]>(`${this.apiBase}/repos/${pull.base.user.login}/${pull.base.repo.name}/pulls/${pull.number}/files`, { headers: this.headers }
      )
    ));
  pullRequestFiles = toSignal(this.pullRequestFiles$, { initialValue: [] as GitHubPullRequestFile[] });


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

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message
        }`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
