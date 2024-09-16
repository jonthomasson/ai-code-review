import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

@Injectable({
  providedIn: 'root'  
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    //if (!this.authService.loginState()) {
    //  this.router.navigate(['/login']);
    //  return false;
    //}
    return true;
  }
}
