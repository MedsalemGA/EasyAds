import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {

    // Vérifier si l'utilisateur est connecté
    if (this.auth.isLoggedIn()) {
      return true; // accès autorisé
    }

    // S'il n'est pas connecté → redirection vers login
    this.router.navigate(['/login']);
    return false;
  }
}
