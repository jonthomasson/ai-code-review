import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from './auth.guard';  // Import AuthGuard
import { LoginComponent } from './login/login.component';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Protect the home route
];
