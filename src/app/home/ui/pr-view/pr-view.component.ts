import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GithubService } from '../../../shared/services/github.service';

@Component({
  selector: 'app-pr-view',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './pr-view.component.html',
  styleUrl: './pr-view.component.css'
})
export class PrViewComponent {
  private githubService: GithubService = inject(GithubService);
  pullRequestFiles = this.githubService.pullRequestFiles;
  isLoading: boolean = true;
  constructor() {
    effect(() => {
      //monitor when aiReview updates and mark isLoading as false
      //this.isLoading = !this.pullRequestFiles()?.some(p => p.aiReview);
    });
  }
}
