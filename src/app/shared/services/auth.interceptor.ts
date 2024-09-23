import { inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '@shared/services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService); 

  const isGitHubRequest = req.url.includes('github.com');
  const authProvider = authService.getProviderType();

  if (isGitHubRequest) {
    const gitHubToken = authService.getOauthToken();
    if (gitHubToken && gitHubToken.trim() !== '' && authProvider === 'github') {
      //console.log('Using GitHub token for:', req.url);
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${gitHubToken}`)
      });
      return next(clonedReq);
    } else {
      const clonedReq = req.clone({
      });

      return next(clonedReq);
    }
  }

  // For non-GitHub requests, use Firebase token
  //console.log('Using Firebase token for:', req.url);
  return from(authService.getFirebaseToken()).pipe(
    switchMap(firebaseToken => {
      if (firebaseToken && firebaseToken.trim() !== '') {
        //console.log(firebaseToken);
        const clonedReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${firebaseToken}`)
        });
        //console.log(clonedReq);
        return next(clonedReq);
      }
      // If no Firebase token is available, continue with the original request
      return next(req);
    })
  );
}
