import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../crud/services/login.service';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent, FooterComponent, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;

  constructor(private loginService: LoginService) {}

  onSubmit() {
    this.loginService.login(this.email, this.password);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
