import { inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '@shared/services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService); 

  const isGitHubRequest = req.url.includes('github.com');

  if (isGitHubRequest && authService.getOauthToken()) {
    const gitHubToken = authService.getOauthToken();
    if (gitHubToken && gitHubToken.trim() !== '') {
      //console.log('Using GitHub token for:', req.url);
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${gitHubToken}`)
      });
      return next(clonedReq);
    }
  }

  // For non-GitHub requests, use Firebase token
  //console.log('Using Firebase token for:', req.url);
  return from(authService.getFirebaseToken()).pipe(
    switchMap(firebaseToken => {
      if (firebaseToken && firebaseToken.trim() !== '') {
        const clonedReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${firebaseToken}`)
        });
        return next(clonedReq);
      }
      // If no Firebase token is available, continue with the original request
      return next(req);
    })
  );
}
