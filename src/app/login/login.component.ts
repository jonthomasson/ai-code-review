import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
      .then(async (result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const githubToken = credential?.accessToken;

        if (githubToken) {
          localStorage.setItem('githubToken', githubToken);  // Store GitHub token

          const user = result.user;
          if (user.photoURL) {
            localStorage.setItem('photoURL', user.photoURL);  // Store GitHub avatar URL
          }

          // Get Firebase user token (firebaseToken)
          const firebaseToken = await user.getIdToken();  // Retrieve Firebase token
          localStorage.setItem('firebaseToken', firebaseToken);  // Store Firebase token for API

          this.router.navigate(['/home']);
        }
      })
      .catch((error) => {
        console.error('GitHub Sign-in Error:', error);
      });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;
        if (user.photoURL) {
          localStorage.setItem('photoURL', user.photoURL);  // Store Google avatar URL
        }

        // Get Firebase user token (firebaseToken)
        const firebaseToken = await user.getIdToken();  // Retrieve Firebase token
        localStorage.setItem('firebaseToken', firebaseToken);  // Store Firebase token for API

        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Google Sign-in Error:', error);
      });
  }


}
