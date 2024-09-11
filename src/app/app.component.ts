// src/app/app.component.ts
import { Component } from '@angular/core';
import { Auth, signInWithPopup, GithubAuthProvider, signOut } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="text-align:center">
      <h1>Welcome to GitHub Auth App!</h1>
      <button (click)="loginWithGitHub()">Login with GitHub</button>
      <button (click)="logout()">Logout</button>
    </div>
  `,
})
export class AppComponent {
  private auth: Auth = inject(Auth);

  loginWithGitHub() {
    const provider = new GithubAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        console.log(result); // The GitHub OAuth Token will be here
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log('OAuth Token:', token);
      })
      .catch((error) => {
        console.error('GitHub Sign-in Error:', error);
      });
  }

  logout() {
    signOut(this.auth);
  }
}
