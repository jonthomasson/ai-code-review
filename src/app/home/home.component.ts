import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './ui/navbar/navbar.component';
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
