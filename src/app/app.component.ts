// src/app/app.component.ts
import { Component, NgModule } from '@angular/core';
import { Auth, signInWithPopup, GithubAuthProvider, signOut } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align:center">
      <h1>Welcome to GitHub Auth App!</h1>
      <button (click)="loginWithGitHub()">Login with GitHub</button>
      <button (click)="logout()">Logout</button>
      <div *ngIf="repositories.length > 0">
        <h2>Your Repositories:</h2>
        <ul>
          <li *ngFor="let repo of repositories">{{ repo.name }}</li>
        </ul>
      </div>
      <div *ngIf="pullRequests.length > 0">
        <h2>Pull Requests:</h2>
        <ul>
          <li *ngFor="let pr of pullRequests">{{ pr.title }}</li>
        </ul>
      </div>
    </div>
  `,
})
export class AppComponent {
  private auth: Auth = inject(Auth);
  repositories: any[] = [];
  pullRequests: any[] = [];

  loginWithGitHub() {
    const provider = new GithubAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        // Get the OAuth token from the result
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (token) {
          // Store the token securely in localStorage
          localStorage.setItem('githubToken', token);

          // Fetch repositories using the token
          this.fetchGitHubRepositories(token);
        }
      })
      .catch((error) => {
        console.error('GitHub Sign-in Error:', error);
      });
  }

  logout() {
    // Clear localStorage and repositories data
    localStorage.removeItem('githubToken');
    this.repositories = [];
    this.pullRequests = [];
    signOut(this.auth);
  }

  fetchGitHubRepositories(token: string) {
    // GitHub API request to get repositories
    fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.repositories = data;
        console.log('Repositories:', this.repositories);

        // For demonstration, fetch PRs for the first repository
        if (this.repositories.length > 0) {
          const firstRepo = this.repositories[0];
          this.fetchPullRequests(token, firstRepo.owner.login, firstRepo.name);
        }
      })
      .catch((error) => console.error('Error fetching repositories:', error));
  }

  fetchPullRequests(token: string, owner: string, repo: string) {
    // GitHub API request to get pull requests for a specific repo
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.pullRequests = data;
        console.log('Pull Requests:', this.pullRequests);
      })
      .catch((error) => console.error('Error fetching pull requests:', error));
  }
}
