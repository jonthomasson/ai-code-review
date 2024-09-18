import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { GithubService } from '@shared/services/github.service';

@Component({
  selector: 'app-pr-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pr-details.component.html',
  styleUrl: './pr-details.component.css'
})
export class PrDetailsComponent {
  private githubService: GithubService = inject(GithubService);
  aiReviewResult = input<any>();
  pullRequest = this.githubService.selectedPullRequest;

  constructor() { }
}
