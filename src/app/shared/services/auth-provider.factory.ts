import { Injectable } from '@angular/core';
import { AuthProvider, GithubAuthProvider, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, OAuthProvider } from '@angular/fire/auth';
import { AuthProviderType } from '@shared/models/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthProviderFactory {

  createAuthProvider(providerType: AuthProviderType): AuthProvider {
    switch (providerType) {
      case 'github':
        const githubProvider = new GithubAuthProvider();
        githubProvider.addScope('repo');  // Add scope for GitHub
        return githubProvider;
      case 'google':
        return new GoogleAuthProvider();
      case 'facebook':
        return new FacebookAuthProvider();
      case 'twitter':
        return new TwitterAuthProvider();
      case 'microsoft':
        const microsoftProvider = new OAuthProvider('microsoft.com');
        microsoftProvider.addScope('User.Read'); 
        return microsoftProvider;
      case 'apple':
        const appleProvider = new OAuthProvider('microsoft.com');
        appleProvider.addScope('email');
        appleProvider.addScope('name');
        return appleProvider;
      case 'yahoo':
        const yahooProvider = new OAuthProvider('yahoo.com');
        yahooProvider.addScope('email'); 
        yahooProvider.addScope('profile'); 
        return yahooProvider;
      default:
        throw new Error('Unsupported provider type');
    }
  }
}
