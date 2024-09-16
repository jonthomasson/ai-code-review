import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
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
  isLoading = input<boolean>(true);
}
