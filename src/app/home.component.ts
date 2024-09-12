import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align:center">
      <h1>GitHub Repositories and Pull Requests</h1>
      <button (click)="logout()">Logout</button>
      
      <div *ngIf="repositories.length > 0">
        <label for="repositories">Select Repository:</label>
        <select id="repositories" (change)="onRepoChange($event)">
          <option *ngFor="let repo of repositories" [value]="repo.name">{{ repo.name }}</option>
        </select>
      </div>

      <div *ngIf="pullRequests.length > 0">
        <label for="pull-requests">Select Pull Request:</label>
        <select id="pull-requests" (change)="onPRChange($event)">
          <option *ngFor="let pr of pullRequests" [value]="pr.url">{{ pr.title }}</option>
        </select>
      </div>

      <div *ngIf="selectedPR">
        <h2>Pull Request Details</h2>
        <pre>{{ selectedPR | json }}</pre>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private router = inject(Router);

  repositories: any[] = [];
  pullRequests: any[] = [];
  selectedPR: any = null;

  ngOnInit() {
    const token = localStorage.getItem('githubToken');
    if (token) {
      this.fetchGitHubRepositories(token);
    }
  }

  fetchGitHubRepositories(token: string) {
    fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.repositories = data;
      })
      .catch((error) => console.error('Error fetching repositories:', error));
  }

  onRepoChange(event: any) {
    const repoName = event.target.value;
    const token = localStorage.getItem('githubToken');
    const selectedRepo = this.repositories.find((repo) => repo.name === repoName);

    if (selectedRepo && token) {
      this.fetchPullRequests(token, selectedRepo.owner.login, repoName);
    }
  }

  fetchPullRequests(token: string, owner: string, repo: string) {
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.pullRequests = data;
      })
      .catch((error) => console.error('Error fetching pull requests:', error));
  }

  onPRChange(event: any) {
    const prUrl = event.target.value;
    const selectedPR = this.pullRequests.find((pr) => pr.url === prUrl);
    this.selectedPR = selectedPR;
  }

  logout() {
    // Clear the localStorage and log out the user
    localStorage.removeItem('githubToken');
    signOut(this.auth)
      .then(() => {
        // Redirect to the login page after successful logout
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
}
