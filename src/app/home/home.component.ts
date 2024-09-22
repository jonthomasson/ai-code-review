import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@shared/services/auth.service';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { GithubService } from '@shared/services/github.service';
import { PrDetailsComponent } from './ui/pr-details/pr-details.component';
import { PrViewComponent } from './ui/pr-view/pr-view.component';
import { PrSelectComponent } from './ui/pr-select/pr-select.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, PrDetailsComponent, PrViewComponent, PrSelectComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 


  constructor() {}

 

  
}
