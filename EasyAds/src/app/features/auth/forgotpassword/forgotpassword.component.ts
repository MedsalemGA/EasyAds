import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-forgotpassword',
  imports: [NavbarComponent, FooterComponent, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  email = '';
  constructor(private router: Router) {}
  onSubmit() {
    this.router.navigate(['/verify-email'], { queryParams: { email: this.email } });
  }
  
}
