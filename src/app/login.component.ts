import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithPopup, GithubAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align:center">
      <h1>Login to GitHub</h1>
      <button *ngIf="!isAuthenticated" (click)="loginWithGitHub()">Login with GitHub</button>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private router = inject(Router);
  isAuthenticated: boolean = false;

  ngOnInit() {
    // Check if user is already logged in
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is authenticated, redirect to home
        this.router.navigate(['/home']);
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  loginWithGitHub() {
    const provider = new GithubAuthProvider();
    provider.addScope('repo');  // Request access to private repositories

    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (token) {
          localStorage.setItem('githubToken', token);
          this.router.navigate(['/home']);
        }
      })
      .catch((error) => {
        console.error('GitHub Sign-in Error:', error);
      });
  }

}
