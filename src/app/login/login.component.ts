import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithPopup, GithubAuthProvider } from '@angular/fire/auth';
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
      .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (token) {
          localStorage.setItem('githubToken', token);
          const user = result.user;
          if (user.photoURL) {
            localStorage.setItem('githubPhotoURL', user.photoURL);  // Store avatar URL
          }

          this.router.navigate(['/home']);
        }
      })
      .catch((error) => {
        console.error('GitHub Sign-in Error:', error);
      });
  }

}
