import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private router = inject(Router);
  private http = inject(HttpClient);  // Inject HttpClient

  repositories: any[] = [];
  pullRequests: any[] = [];
  selectedPR: any = null;
  pullRequestFiles: any[] = [];
  userPhotoUrl: string | null = null;

  ngOnInit() {
    const token = localStorage.getItem('githubToken');
    if (token) {
      this.fetchGitHubRepositories(token);

      const photoURL = localStorage.getItem('githubPhotoURL');
      if (photoURL) {
        this.userPhotoUrl = photoURL;
      }
    }
  }

  fetchGitHubRepositories(token: string) {
    fetch('https://api.github.com/user/repos?per_page=100', {
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

  fetchPullRequestFiles(token: string, owner: string, repo: string, pullNumber: number) {
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const selectedPR = this.pullRequests.find(pr => pr.url === prUrl);
    this.selectedPR = selectedPR;

    // Fetch file changes and additional PR details
    if (this.selectedPR) {
      const token = localStorage.getItem('githubToken');

      if (token) {
        this.fetchPullRequestFiles(token, this.selectedPR.base.user.login, this.selectedPR.base.repo.name, this.selectedPR.number);

        // Optionally fetch more detailed information about the selected pull request if needed
        this.fetchPullRequestDetails(token, this.selectedPR.base.user.login, this.selectedPR.base.repo.name, this.selectedPR.number);
      } else {
        console.error('No GitHub token found in localStorage');
      }
    }
  }

  
  fetchPullRequestDetails(token: string, owner: string, repo: string, pullNumber: number) {
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.selectedPR = { ...this.selectedPR, ...data };
      })
      .catch(error => console.error('Error fetching pull request details:', error));
  }

  sendFileChangesToApi(fileChanges: any[]) {
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
      .subscribe(response => {
        console.log('AI Review response:', response);
        // Handle the response from your API (e.g., display AI suggestions)
      }, error => {
        console.error('Error sending file changes to API:', error);
      });
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
