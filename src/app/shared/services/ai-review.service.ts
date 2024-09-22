import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { filter, map, switchMap, tap, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CodeReviewResponse } from '@shared/models/ai-review';
import { GithubService } from './github.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AiReviewService {
  apiBase: string = environment.apiUrl;
  http = inject(HttpClient);
  githubService = inject(GithubService);

  pullRequestFiles = this.githubService.pullRequestFiles;

  // Signal to track loading state
  reviewLoading = signal<boolean>(true);

  // Observable pipeline for code review
  private codeReviewResponse$ = toObservable(this.pullRequestFiles).pipe(
    filter(Boolean), // Ensure prFiles is defined and truthy
    filter(prFiles => prFiles.length > 0), // Ensure prFiles is not empty
    map(prFiles => // Map the prFiles to only include filename and patch
      prFiles.map(file => ({
        filename: file.filename,
        patch: file.patch
      }))
    ),
    switchMap(mappedFiles => {
      this.reviewLoading.set(true); // Set loading state to true before making the HTTP request
      return this.http.post<CodeReviewResponse>(`${this.apiBase}/review`, mappedFiles).pipe(
        tap(() => this.reviewLoading.set(false)), // Set loading state to false after request completes
        catchError(err => {
          console.error('Error fetching AI review', err);
          this.reviewLoading.set(false); // Set loading to false on error
          return of({} as CodeReviewResponse); // Return an empty response in case of error
        })
      );
    })
  );

  // Signal to track code review responses
  codeReviewResponses = toSignal(this.codeReviewResponse$, { initialValue: {} as CodeReviewResponse });
}
