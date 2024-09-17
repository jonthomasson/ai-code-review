import { Injectable, computed, inject, signal } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { OAuthProvider, User, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { AuthProviderType } from '@shared/models/auth';
import { AuthProviderFactory } from '@shared/services/auth-provider.factory';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  currentUser = signal<User | null>(null);
  hasGithub = computed<boolean>(() => this.currentUser()?.providerData.some(provider => provider.providerId === 'github.com') || false);
  
  constructor(private authProviderFactory: AuthProviderFactory, private toastr: ToastrService) {
    //setup auth observer
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser.set(user);
        this.router.navigate(['/home']);
      } else {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  public async getFirebaseToken(): Promise<string | null> {
    const user = this.currentUser();
    if (user) {
      try {
        return await user.getIdToken(true);
      } catch (error) {
        console.log(error);
        this.toastr.error('Error retrieving token');
        return null;
      }
    }
    return null;
  }

  public getOauthToken(): string | null {
    return sessionStorage.getItem('oauthToken');
  }

  
  public login(providerType: AuthProviderType) {
    const provider = this.authProviderFactory.createAuthProvider(providerType);

    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        //Retrieve the OAuth access token if needed
        const credential = OAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (token) {
          sessionStorage.setItem('oauthToken', token); //oauth token can be used later when using github api.
        }
        this.toastr.success(`Logged in successfully with ${providerType}`);
      })
      .catch((error) => {
        console.error('OAuth Sign-in Error:', error);
      });
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        sessionStorage.removeItem('oauthToken');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
}
