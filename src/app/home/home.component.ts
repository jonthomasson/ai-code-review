import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { GithubService } from '../shared/services/github.service';
import { GitHubRepository } from '../shared/models/github';
import { Observable } from 'rxjs';
import { AiReviewService } from '../shared/services/ai-review.service';
import { PrDetailsComponent } from './ui/pr-details/pr-details.component';
import { PrViewComponent } from './ui/pr-view/pr-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, PrDetailsComponent, PrViewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private authService: AuthService = inject(AuthService);

  repositories$: Observable<GitHubRepository[]> | undefined;
  pullRequests: any[] = [];
  selectedPR: any = null;
  pullRequestFiles: any[] = [];
  isGoogleUser: boolean = false;
  repoUrl: string = '';
  aiReviewResult: { standards: string, score: number } | null = null;
  isLoading: boolean = true;
  currentUser = this.authService.currentUser;
  hasGithub: boolean = this.authService.hasGithub();

  constructor(private http: HttpClient, private githubService: GithubService, private aiReviewService: AiReviewService) {
   
  }

  ngOnInit() {
    if (this.hasGithub) {
      this.repositories$ = this.githubService.getGitHubRepositories();
    }
  }

  onRepoUrlInput(event: any) {
    const repoUrl = event.target.value;
    const match = repoUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)$/);
    if (match) {
      const owner = match[1];
      const repo = match[2];
      this.getPullRequests(owner, repo);
    }
  }

  onRepoChange(event: any) {
    this.selectedPR = null;
    this.pullRequestFiles = [];
    const repoName = event.target.value;

    // Subscribe to the repositories$ observable
    this.repositories$?.subscribe(repositories => {
      const selectedRepo = repositories.find(repo => repo.name === repoName);

      if (selectedRepo) {
        this.getPullRequests(selectedRepo.owner.login, repoName);
      }
    });
  }



  getPullRequestFiles(owner: string, repo: string, pullNumber: number) {
    this.githubService.getPullRequestFiles(owner, repo, pullNumber)
      .subscribe({
        next: (data: any) => {
          this.pullRequestFiles = data;

          this.sendFileChangesToApi(this.pullRequestFiles);
        },
        error: (error) => {
          console.error('Error fetching pull request files:', error);
        }
      });
  }


  getPullRequests(owner: string, repo: string) {
    this.githubService.getPullRequests(owner, repo)
      .subscribe({
        next: (data: any) => {
          this.pullRequests = data;
        },
        error: (error) => {
          console.error('Error fetching pull requests:', error);
        }
      });
  }


  onPRChange(event: any) {
    const prUrl = event.target.value;
    const selectedPR = this.pullRequests.find(pr => pr.url === prUrl);
    this.selectedPR = selectedPR;

    // Fetch file changes and additional PR details
    if (this.selectedPR) {
      this.getPullRequestFiles(this.selectedPR.base.user.login, this.selectedPR.base.repo.name, this.selectedPR.number);

      // Optionally fetch more detailed information about the selected pull request if needed
      this.getPullRequestDetails(this.selectedPR.base.user.login, this.selectedPR.base.repo.name, this.selectedPR.number);

    }
  }

  getPullRequestDetails(owner: string, repo: string, pullNumber: number) {
    this.githubService.getPullRequestDetails(owner, repo, pullNumber)
      .subscribe({
        next: (data) => {
          this.selectedPR = { ...this.selectedPR, ...data };
        },
        error: (error) => {
          console.error('Error fetching pull request details:', error);
        }
      });
  }

  sendFileChangesToApi(fileChanges: any[]) {
    this.isLoading = true;

    // Map over fileChanges to extract only the filename and patch
    const fileChangePayload = fileChanges.map(file => ({
      fileName: file.filename,
      patch: file.patch
    }));

    this.aiReviewService.submitCodePR(fileChangePayload).then(submission$ => {
      submission$.subscribe({
        next: (response: any) => {
          this.mapAiSuggestionsToFiles(response.codeReview);
          this.aiReviewResult = { standards: response.standards, score: response.score };
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error sending file changes to API:', error);
        }
      });
    });
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
