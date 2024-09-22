import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GithubService } from '@shared/services/github.service';
import { AiReviewService } from '@shared/services/ai-review.service';
import { GitHubPullRequestFile } from '@shared/models/github';

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

  isLoadingPullRequest = this.githubService.pullRequestLoading;
  isLoadingReview = this.aiReviewService.reviewLoading;

  pullRequest = this.githubService.selectedPullRequest;
  pullRequestCodeReview = this.aiReviewService.pullRequestCodeReview;

  isLoading = computed<boolean>(() =>
    this.isLoadingPullRequest() || this.isLoadingReview()
  );
}
