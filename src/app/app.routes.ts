import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './login/login.component';

// Define the redirection function for unauthorized users
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } }
];
