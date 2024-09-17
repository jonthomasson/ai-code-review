import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-pr-view',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './pr-view.component.html',
  styleUrl: './pr-view.component.css'
})
export class PrViewComponent {
  pullRequestFiles = input<any[]>([]);
  isLoading: boolean = true;
  constructor() {
    effect(() => {
      //monitor when aiReview updates and mark isLoading as false
      this.isLoading = !this.pullRequestFiles().some(p => p.aiReview);
    });
  }
}
