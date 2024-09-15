import { Component, OnInit } from '@angular/core';
import { GithubAuthProvider, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit() {

  }

  loginWithGitHub() {
    const provider = new GithubAuthProvider();
    provider.addScope('repo');  // Request access to private repositories

    this.authService.login(provider);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    this.authService.login(provider);
  }


}
