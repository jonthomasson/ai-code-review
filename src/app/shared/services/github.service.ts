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

  constructor() {
  }
  

  //expose observables as private so that they can only be subscribed here by our signals.
  //repositories
  private repositories$ = this.http.get<GitHubRepository[]>(`${this.apiBase}/user/repos?per_page=100&type=all`).pipe( 
    shareReplay(1),
    catchError(this.handleError)
  );
  repositories = toSignal(this.repositories$, { initialValue: [] as GitHubRepository[] });
  selectedRepository = signal<GitHubRepository | undefined>(undefined);

  //pull requests
  private pullRequests$ = toObservable(this.selectedRepository).pipe(
    filter(Boolean),
    switchMap(repo =>
      this.http.get<GitHubPullRequest[]>(`${this.apiBase}/repos/${repo.owner.login}/${repo.name}/pulls`)
    ));
  pullRequests = toSignal(this.pullRequests$, { initialValue: [] as GitHubPullRequest[] });
  selectedPullRequest = signal<GitHubPullRequest | undefined>(undefined);

  //pull request files
  private pullRequestFiles$ = toObservable(this.selectedPullRequest).pipe(
    filter(Boolean),
    switchMap(pull =>
      this.http.get<GitHubPullRequestFile[]>(`${this.apiBase}/repos/${pull.base.user.login}/${pull.base.repo.name}/pulls/${pull.number}/files`)
    ));
  pullRequestFiles = toSignal(this.pullRequestFiles$, { initialValue: [] as GitHubPullRequestFile[] });


  repositorySelected(repoName: string) {
    const foundRepo = this.repositories()?.find((r) => r.name === repoName);
    this.selectedRepository.set(foundRepo);
  }

  pullRequestSelected(prUrl: string) {
    const foundPr = this.pullRequests()?.find(pr => pr.url === prUrl);;
    this.selectedPullRequest.set(foundPr);
  }

  getGitHubRepositories(): Observable<GitHubRepository[]> {
    return this.http.get<GitHubRepository[]>(`${this.apiBase}/user/repos?per_page=100&type=all`)
  }

  getPullRequests(owner: string, repo: string): Observable<GitHubPullRequest[]> {
    return this.http.get<GitHubPullRequest[]>(`${this.apiBase}/repos/${owner}/${repo}/pulls`);
  }

  getPullRequestFiles(owner: string, repo: string, pullNumber: number): Observable<GitHubPullRequestFile[]> {
    return this.http.get<GitHubPullRequestFile[]>(`${this.apiBase}/repos/${owner}/${repo}/pulls/${pullNumber}/files`);
  }

  getPullRequestDetails(owner: string, repo: string, pullNumber: number): Observable<GitHubPullRequest> {
    return this.http.get<GitHubPullRequest>(`${this.apiBase}/repos/${owner}/${repo}/pulls/${pullNumber}`);
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
