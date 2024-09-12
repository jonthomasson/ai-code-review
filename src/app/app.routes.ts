import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { HomeComponent } from './home.component';
import { AuthGuard } from './auth.guard';  // Import AuthGuard

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Protect the home route
];
