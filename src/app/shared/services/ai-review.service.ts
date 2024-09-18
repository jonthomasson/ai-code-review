import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { filter, switchMap } from 'rxjs';
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
    filter(Boolean),
    filter(prFiles => prFiles.length > 0),
    switchMap(prFiles =>
      this.http.post<CodeReviewResponse>(`${this.apiBase}/review`, prFiles)
    )
  );

  codeReviewResponses = toSignal(this.codeReviewResponse$, { initialValue: {} as CodeReviewResponse });

  //constructor() { }

  //async submitCodePR(fileChanges: FileChanges[]): Promise<Observable<CodeReviewResponse>> {  
  //  return this.http.post<CodeReviewResponse>(`${this.apiBase}/review`, fileChanges);
  //}
}
