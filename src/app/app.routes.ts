import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@angular/fire/auth-guard';
import { LoginComponent } from './login/login.component';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
];
