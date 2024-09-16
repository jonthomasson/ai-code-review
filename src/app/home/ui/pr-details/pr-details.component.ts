import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { GitHubPullRequest } from '../../../shared/models/github';
import { CodeReviewResponse } from '../../../shared/models/ai-review';

@Component({
  selector: 'app-pr-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pr-details.component.html',
  styleUrl: './pr-details.component.css'
})
export class PrDetailsComponent {
  selectedPR = input<any>();
  aiReviewResult = input<any>();
}
