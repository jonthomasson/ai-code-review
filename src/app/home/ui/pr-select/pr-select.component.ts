import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { GithubService } from '@shared/services/github.service';

@Component({
  selector: 'app-pr-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pr-select.component.html',
  styleUrl: './pr-select.component.css'
})
export class PrSelectComponent {
  private authService: AuthService = inject(AuthService);
  private githubService: GithubService = inject(GithubService);

  repositories = this.githubService.repositories;
  pullRequests = this.githubService.pullRequests;
  hasGithub = this.authService.hasGithub;

  onRepoUrlInput(event: any) {
    const repoUrl = event.target.value;
    const match = repoUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)$/);
    if (match) {
      const repoOwner = match[1];
      const repoName = match[2];
      this.githubService.repositorySelected(repoName, repoOwner);
    }
  }

  onRepoChange(event: any) {
    const repoName = event.target.value;
    this.githubService.repositorySelected(repoName);
  }

  onPRChange(event: any) {
    this.githubService.pullRequestSelected(event.target.value);
  }
}
