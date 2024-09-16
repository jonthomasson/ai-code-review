import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Signal } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AuthService } from '../shared/services/auth.service';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { GithubService } from '../shared/services/github.service';
import { GitHubRepository } from '../shared/models/github';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NgxSkeletonLoaderModule],
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

  constructor(private http: HttpClient, private githubService: GithubService) {
   
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
      this.fetchPullRequests('', owner, repo);
    }
  }

  //getGitHubRepositories() {
  //  this.githubService.getGitHubRepositories().subscribe(
  //    (data) => {
  //      this.repositories = data;
  //    },
  //    (error) => console.error('Error fetching repositories:', error)
  //  );

  //}

  onRepoChange(event: any) {
    this.selectedPR = null;
    this.pullRequestFiles = [];
    const repoName = event.target.value;
    const token = localStorage.getItem('githubToken');

    // Subscribe to the repositories$ observable
    this.repositories$?.subscribe(repositories => {
      const selectedRepo = repositories.find(repo => repo.name === repoName);

      if (selectedRepo && token) {
        this.fetchPullRequests(token, selectedRepo.owner.login, repoName);
      }
    });
  }



  fetchPullRequestFiles(token: string, owner: string, repo: string, pullNumber: number) {
    const headers: any = {};

    // Conditionally add the Authorization header if a token is provided
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
      headers,
    })
      .then(response => response.json())
      .then(data => {
        this.pullRequestFiles = data;
        console.log('Pull Request Files:', this.pullRequestFiles);

        // Post pull request files to the API
        this.sendFileChangesToApi(this.pullRequestFiles);
      })
      .catch(error => console.error('Error fetching pull request files:', error));
  }

  fetchPullRequests(token: string, owner: string, repo: string) {
    const headers: any = {};

    // Conditionally add the Authorization header if a token is provided
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        this.pullRequests = data;
      })
      .catch((error) => console.error('Error fetching pull requests:', error));
  }

  onPRChange(event: any) {
    const prUrl = event.target.value;
    const selectedPR = this.pullRequests.find(pr => pr.url === prUrl);
    this.selectedPR = selectedPR;

    // Fetch file changes and additional PR details
    if (this.selectedPR) {
      const token = localStorage.getItem('githubToken') ?? '';

      this.fetchPullRequestFiles(token, this.selectedPR.base.user.login, this.selectedPR.base.repo.name, this.selectedPR.number);

      // Optionally fetch more detailed information about the selected pull request if needed
      this.fetchPullRequestDetails(token, this.selectedPR.base.user.login, this.selectedPR.base.repo.name, this.selectedPR.number);

    }
  }


  fetchPullRequestDetails(token: string | null, owner: string, repo: string, pullNumber: number) {
    const headers: any = {};

    // Conditionally add the Authorization header if a token is provided
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
      headers: headers,
    })
      .then(response => response.json())
      .then(data => {
        this.selectedPR = { ...this.selectedPR, ...data };
      })
      .catch(error => console.error('Error fetching pull request details:', error));
  }


  sendFileChangesToApi(fileChanges: any[]) {
    this.isLoading = true;
    const apiEndpoint = 'https://localhost:7148/api/review'; // Replace with your .NET Core API endpoint
    const token = localStorage.getItem('firebaseToken');

    // Map over fileChanges to extract only the filename and patch
    const fileChangePayload = fileChanges.map(file => ({
      fileName: file.filename,
      patch: file.patch
    }));

    this.http.post(apiEndpoint, fileChangePayload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .subscribe((response: any) => {
        this.mapAiSuggestionsToFiles(response.codeReview);
        this.aiReviewResult = { standards: response.standards, score: response.score };
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        console.error('Error sending file changes to API:', error);
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

function WritableSignal<T>(arg0: never[]) {
  throw new Error('Function not implemented.');
}
