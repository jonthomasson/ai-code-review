import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@shared/services/auth.service';
import { AuthProviderType } from '@shared/models/auth';
import { LoginButtonsComponent } from './ui/login-buttons/login-buttons.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginButtonsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthService) {

  }

  login(providerType: AuthProviderType) {
    this.authService.login(providerType);
  }
}
