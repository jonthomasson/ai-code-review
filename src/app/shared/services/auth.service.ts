import { Injectable, inject, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GithubAuthProvider, AuthProvider, User, onAuthStateChanged, signInWithPopup } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  currentUser = signal<User | null>(null);
  loginState = signal<boolean>(false);

  constructor() {
    //setup auth observer
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser.set(user);
        this.loginState.set(true);
        this.router.navigate(['/home']);
      } else {
        this.currentUser.set(null);
        this.loginState.set(false);
        this.router.navigate(['/login']);
      }
    });
  }

  public login(provider: AuthProvider) {
    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        //// Retrieve the OAuth access token if needed
        //const credential = OAuthProvider.credentialFromResult(result);
        //const token = credential?.accessToken;
        //console.log('OAuth Token:', token);

        console.log('Signed in successfully:', result);
      })
      .catch((error) => {
        // Log error and handle specific error cases (if needed)
        console.error('OAuth Sign-in Error:', error);
      });
  }
 
  
}
