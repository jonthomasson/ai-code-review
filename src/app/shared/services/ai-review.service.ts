import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { filter, map, switchMap } from 'rxjs';
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
  private codeReviewResponse$ = toObservable(this.pullRequestFiles).pipe(
    filter(Boolean), // Ensure prFiles is defined and truthy
    filter(prFiles => prFiles.length > 0), // Ensure prFiles is not empty
    map(prFiles => // Map the prFiles to only include filename and patch
      prFiles.map(file => ({
        filename: file.filename,
        patch: file.patch
      }))
    ),
    switchMap(mappedFiles =>
      this.http.post<CodeReviewResponse>(`${this.apiBase}/review`, mappedFiles)
    )
  );

  codeReviewResponses = toSignal(this.codeReviewResponse$, { initialValue: {} as CodeReviewResponse });

  //constructor() { }

  //async submitCodePR(fileChanges: FileChanges[]): Promise<Observable<CodeReviewResponse>> {  
  //  return this.http.post<CodeReviewResponse>(`${this.apiBase}/review`, fileChanges);
  //}
}
