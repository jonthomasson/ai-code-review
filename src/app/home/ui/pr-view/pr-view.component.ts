import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GithubService } from '@shared/services/github.service';
import { AiReviewService } from '@shared/services/ai-review.service';

export interface CodeReviewResponse {
  standards: string;
  score: number;
  codeReview: CodeReview[];
}

export interface CodeReview {
  fileName: string;
  review: string;
}

export interface GitHubPullRequestFile {
  filename: string;
  patch: string;
  aiReview?: string;  // Make aiReview optional to start
}

@Component({
  selector: 'app-pr-view',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './pr-view.component.html',
  styleUrl: './pr-view.component.css'
})
export class PrViewComponent {
  private githubService: GithubService = inject(GithubService);
  private aiReviewService: AiReviewService = inject(AiReviewService);

  pullRequestFiles = this.githubService.pullRequestFiles;
  codeReviewResponses = this.aiReviewService.codeReviewResponses;
  pullRequestCodeReview = computed<GitHubPullRequestFile[] | undefined>(() =>
    this.pullRequestFiles()?.map((file) => {
      const review = this.codeReviewResponses()?.codeReview?.find((review) => review.fileName === file.filename);
      if (review) {
        file.aiReview = review.review;
      } else {
        file.aiReview = 'Review Pending';  
      }
      return file;
    })
  );

  isLoading = computed<boolean>(() =>
    this.pullRequestCodeReview()?.some((file) => !file.aiReview || file.aiReview === 'Review Pending') || false
  );
 
}
