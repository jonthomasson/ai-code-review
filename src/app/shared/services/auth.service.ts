import { Injectable, inject, signal } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthProvider, OAuthProvider, User, onAuthStateChanged, signInWithPopup } from "firebase/auth";

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

  public hasGithub(): boolean {
    return this.currentUser()?.providerData.some(provider => provider.providerId === 'github.com') || false;
  }

  public getOauthToken(): string | null {
    return sessionStorage.getItem('oauthToken');
  }

  
  public login(provider: AuthProvider) {
    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        //Retrieve the OAuth access token if needed
        const credential = OAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (token) {
          sessionStorage.setItem('oauthToken', token); //oauth token can be used later when using github api.
        }
      })
      .catch((error) => {
        console.error('OAuth Sign-in Error:', error);
      });
  }

  logout() {
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
