import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../../crud/services/register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [NavbarComponent, FooterComponent, RouterLink, RouterLinkActive, FormsModule, NgIf, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  constructor(private registerService: RegisterService, private router: Router) { }

name = '';
  email = '';
  phone = '';
  wilaya='';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  newsletter = true;
  alertMessage = '';
  color='red';
  enablebutton=true;
  showPassword = false;
  showConfirmPassword = false;
  wilayas=[
      "Ariana",
      "Béja",
      "Ben Arous",
      "Bizerte",
      "Gabès",
      "Gafsa",
      "Jendouba",
      "Kairouan",
      "Kasserine",
      "Kébili",
      "Le Kef",
      "Mahdia",
      "La Manouba",
      "Médenine",
      "Monastir",
      "Nabeul",
      "Sfax",
      "Sidi Bouzid",
      "Siliana",
      "Sousse",
      "Tozeur",
      "Tataouine",
      "Tunis",
      "Zaghouan",
  ]
  ngOnInit(): void {
    this.color='';
    
  }
  ontype(event: KeyboardEvent,password:string)
  {
    
   
    if(this.findmaj(password)===false && this.findother(password)===false){
      this.alertMessage='Votre mot de passe est tres faible!';
      this.color='red';
      return;
    }
    if(this.findmaj(this.password)===true || this.findother(this.password)===true ){
      
      this.alertMessage='Votre mot de passe est moyen';
      this.color='yellow'
    }
    if(this.findmaj(this.password)===true && this.findother(this.password)===true){
      this.alertMessage='Mot de passe fort!';
      this.color='green';
    }
  }
  onRegister() {
    // Validation des mots de passe
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas !',
      });
      return;
    }

    // Vérifier que le mot de passe ne contient pas l'email
    if (this.password.includes(this.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Mot de passe faible',
        text: 'Le mot de passe ne doit pas contenir l\'email',
      });
      return;
    }

    // Vérifier la force du mot de passe
    if (this.findmaj(this.password) === false && this.findother(this.password) === false) {
      Swal.fire({
        icon: 'warning',
        title: 'Mot de passe trop faible',
        text: 'Votre mot de passe doit contenir au moins une majuscule ou un caractère spécial.',
      });
      return;
    }

    // Vérifier l'acceptation des conditions
    if (!this.acceptTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Conditions non acceptées',
        text: 'Vous devez accepter les conditions d\'utilisation',
      });
      return;
    }

    // Appeler le service d'inscription
    this.registerService.register({
      name: this.name,
      email: this.email,
      phone: this.phone,
      wilaya: this.wilaya,
      password: this.password,
      role: 'client' // Par défaut, tous les nouveaux utilisateurs sont des clients
    });
  }
  alertduration(){
    setTimeout(() => {
      this.alertMessage = '';
      this.color='';
    }, 3000);
  }
  findmaj(password:string){
    for(let i=0;i<password.length;i++){
      const char = password[i];
       if (char >= 'A' && char <= 'Z') {   
      return true;
    }
    }
    return false;
  }
  findother(password:string){
    for(let i=0;i<password.length;i++){

      if(password[i]==='@' || password[i]==='!' || password[i]==='#' || password[i]==='$' || password[i]==='%' || password[i]==='^' || password[i]==='&' || password[i]==='*' || password[i]==='(' || password[i]===')' || password[i]==='-' || password[i]==='_' || password[i]==='+' || password[i]==='=' || password[i]==='{' || password[i]==='}' || password[i]==='[' || password[i]===']' || password[i]==='|' || password[i]==='\\' || password[i]===':' || password[i]===';' || password[i]==='"' || password[i]==='<' || password[i]==='>' || password[i]==='?' || password[i]==='/'){
        return true;
      }
    }
    return false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}