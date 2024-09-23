import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, filter, forkJoin, map, of, shareReplay, switchMap, throwError, tap } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { GitHubRepository, GitHubPullRequest, GitHubPullRequestFile } from '@shared/models/github';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  apiBase: string = 'https://api.github.com';
  http = inject(HttpClient);

  constructor() { }

  // Expose observables as private so they can only be subscribed to internally by our signals.

  // Repositories
  private repositories$ = this.http.get<GitHubRepository[]>(`${this.apiBase}/user/repos?per_page=100&type=all`).pipe(
    shareReplay(1), // Cache the result and replay to new subscribers
    catchError(this.handleError) 
  );
  repositories = toSignal(this.repositories$, { initialValue: [] as GitHubRepository[] });
  selectedRepository = signal<GitHubRepository | undefined>(undefined);

  // Pull Requests
  private pullRequests$ = toObservable(this.selectedRepository).pipe(
    filter(Boolean), // Ensure the selected repository is not undefined or null
    switchMap(repo =>
      this.http.get<GitHubPullRequest[]>(`${this.apiBase}/repos/${repo.owner.login}/${repo.name}/pulls`).pipe(
        catchError(this.handleError)
      )
    )
  );
  pullRequests = toSignal(this.pullRequests$, { initialValue: [] as GitHubPullRequest[] });
  selectedPullRequest = signal<GitHubPullRequest | undefined>(undefined);

  // Pull Request Files
  pullRequestLoading = signal<boolean>(true);
  private pullRequestFiles$ = toObservable(this.selectedPullRequest).pipe(
    filter(Boolean), // Ensure the selected pull request is not undefined or null
    switchMap(pull => {
      this.pullRequestLoading.set(true); // Set loading state to true before HTTP request
      return this.http.get<GitHubPullRequestFile[]>(`${this.apiBase}/repos/${pull.base.user.login}/${pull.base.repo.name}/pulls/${pull.number}/files`).pipe(
        tap(() => this.pullRequestLoading.set(false)), // Set loading to false after request completes
        catchError(err => {
          this.pullRequestLoading.set(false); // Ensure loading state is reset on error
          return this.handleError(err);
        })
      );
    })
  );
  pullRequestFiles = toSignal(this.pullRequestFiles$, { initialValue: [] as GitHubPullRequestFile[] });

  repositorySelected(repoName: string, ownerName: string = '') {
    let foundRepo: GitHubRepository | undefined;

    if (ownerName !== '') {
      foundRepo = {
        id: 0, 
        name: repoName,
        owner: {
          login: ownerName
        }
      };
    } else {
      foundRepo = this.repositories()?.find((r) => r.name === repoName);
    }

    this.selectedPullRequest.set(undefined);

    this.selectedRepository.set(foundRepo);
  }

  pullRequestSelected(prUrl: string) {
    const foundPr = this.pullRequests()?.find(pr => pr.url === prUrl);
    this.selectedPullRequest.set(foundPr);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
