import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@shared/services/auth.service';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { GithubService } from '@shared/services/github.service';
import { PrDetailsComponent } from './ui/pr-details/pr-details.component';
import { PrViewComponent } from './ui/pr-view/pr-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, PrDetailsComponent, PrViewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private authService: AuthService = inject(AuthService);
  private githubService: GithubService = inject(GithubService);

  repositories = this.githubService.repositories;
  repository = this.githubService.selectedRepository;
  pullRequests = this.githubService.pullRequests;
  pullRequest = this.githubService.selectedPullRequest;
  hasGithub = this.authService.hasGithub;


  constructor() {}

  onRepoUrlInput(event: any) {
    const repoUrl = event.target.value;
    const match = repoUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)$/);
    if (match) {
      const owner = match[1];
      const repo = match[2];
      //this.getPullRequests(owner, repo);
      //call repositorySelected

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
