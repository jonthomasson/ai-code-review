import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@shared/services/auth.service';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { GithubService } from '@shared/services/github.service';
import { GitHubRepository } from '@shared/models/github';
import { Observable } from 'rxjs';
import { AiReviewService } from '@shared/services/ai-review.service';
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
  private aiReviewService: AiReviewService = inject(AiReviewService);


  repositories = this.githubService.repositories;
  repository = this.githubService.selectedRepository;
  pullRequests = this.githubService.pullRequests;
  pullRequest = this.githubService.selectedPullRequest;

  selectedPR: any = null;
  pullRequestFiles: any[] = [];
  aiReviewResult: { standards: string, score: number } | null = null;
  hasGithub = this.authService.hasGithub;

  constructor() {}

  onRepoUrlInput(event: any) {
    const repoUrl = event.target.value;
    const match = repoUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)$/);
    if (match) {
      const owner = match[1];
      const repo = match[2];
      //this.getPullRequests(owner, repo);
    }
  }

  onRepoChange(event: any) {
    this.selectedPR = null;
    this.aiReviewResult = null;
    this.pullRequestFiles = [];
    const repoName = event.target.value;

    this.githubService.repositorySelected(repoName);
  }

  getPullRequestFiles(owner: string, repo: string, pullNumber: number) {
    //this.githubService.getPullRequestFiles(owner, repo, pullNumber)
    //  .subscribe({
    //    next: (data: any) => {
    //      this.pullRequestFiles = data;

    //      this.sendFileChangesToApi(this.pullRequestFiles);
    //    },
    //    error: (error) => {
    //      console.error('Error fetching pull request files:', error);
    //    }
    //  });
  }

  onPRChange(event: any) {
    this.aiReviewResult = null;

    this.githubService.pullRequestSelected(event.target.value);
    //const selectedPR = this.pullRequests()?.find(pr => pr.url === prUrl);
    //this.selectedPR = selectedPR;


    //// Fetch file changes and additional PR details
    //if (this.selectedPR) {
    //  this.getPullRequestFiles(this.selectedPR.base.user.login, this.selectedPR.base.repo.name, this.selectedPR.number);

    //  // Optionally fetch more detailed information about the selected pull request if needed
    //  this.getPullRequestDetails(this.selectedPR.base.user.login, this.selectedPR.base.repo.name, this.selectedPR.number);

    //}
  }

  //getPullRequestDetails(owner: string, repo: string, pullNumber: number) {
  //  this.githubService.getPullRequestDetails(owner, repo, pullNumber)
  //    .subscribe({
  //      next: (data) => {
  //        this.selectedPR = { ...this.selectedPR, ...data };
  //      },
  //      error: (error) => {
  //        console.error('Error fetching pull request details:', error);
  //      }
  //    });
  //}

  sendFileChangesToApi(fileChanges: any[]) {

    // Map over fileChanges to extract only the filename and patch
    //const fileChangePayload = fileChanges.map(file => ({
    //  fileName: file.filename,
    //  patch: file.patch
    //}));

    //this.aiReviewService.submitCodePR(fileChangePayload).then(submission$ => {
    //  submission$.subscribe({
    //    next: (response: any) => {
    //      this.mapAiSuggestionsToFiles(response.codeReview);
    //      this.aiReviewResult = { standards: response.standards, score: response.score };
    //    },
    //    error: (error) => {
    //      console.error('Error sending file changes to API:', error);
    //    }
    //  });
    //});
  }

  mapAiSuggestionsToFiles(aiCodeReviews: any[]) {
    this.pullRequestFiles = this.pullRequestFiles.map(file => {
      const aiReview = aiCodeReviews.find(review => review.fileName === file.filename);
      return {
        ...file,
        aiReview: aiReview ? aiReview.review : 'No suggestions.'
      };
    });
  }
}
