import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthProviderType } from '@shared/models/auth';

@Component({
  selector: 'app-login-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-buttons.component.html',
  styleUrl: './login-buttons.component.css'
})
export class LoginButtonsComponent {
  @Output() login = new EventEmitter<AuthProviderType>();
  availableProviders: AuthProviderType[] = ['github', 'google', 'microsoft'];

  onLoginClick(providerType: AuthProviderType) {
    this.login.emit(providerType); 
  }

  getButtonClass(provider: AuthProviderType): string {
    switch (provider) {
      case 'github':
        return 'btn btn-github';
      case 'google':
        return 'btn btn-google';
      case 'facebook':
        return 'btn btn-facebook';
      case 'apple':
        return 'btn btn-apple';
      case 'twitter':
        return 'btn btn-twitter';
      case 'yahoo':
        return 'btn btn-yahoo';
      case 'microsoft':
        return 'btn btn-microsoft';
      default:
        return 'btn btn-primary';
    }
  }

  getIconClass(provider: AuthProviderType): string {
    switch (provider) {
      case 'github':
        return 'bi bi-github';
      case 'google':
        return 'bi bi-google';
      case 'facebook':
        return 'bi bi-facebook';
      case 'apple':
        return 'bi bi-apple';
      case 'twitter':
        return 'bi bi-twitter';
      case 'yahoo':
        return 'bi bi-yahoo';
      case 'microsoft':
        return 'bi bi-microsoft';
      default:
        return 'bi bi-lock';
    }
  }

}
