import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { GithubService } from '@shared/services/github.service';
import { AiReviewService } from '@shared/services/ai-review.service';

@Component({
  selector: 'app-pr-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pr-details.component.html',
  styleUrl: './pr-details.component.css'
})
export class PrDetailsComponent {
  private aiReviewService: AiReviewService = inject(AiReviewService);
  private githubService: GithubService = inject(GithubService);
  pullRequest = this.githubService.selectedPullRequest;
  codeReviewResponses = this.aiReviewService.codeReviewResponses;
  isLoadingReview = this.aiReviewService.reviewLoading;

  constructor() { }
}
