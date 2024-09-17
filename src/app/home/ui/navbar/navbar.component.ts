import { Component, inject } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService: AuthService = inject(AuthService);
  currentUser = this.authService.currentUser;

  constructor() { }

  public logout() {
    this.authService.logout();
  }
}
