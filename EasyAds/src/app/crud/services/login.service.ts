import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    // Préparer les données à envoyer (utiliser 'adressemail' au lieu de 'email')
    const loginData = {
      adressemail: email,
      password: password
    };

    // Envoyer une requête POST avec les données dans le body
    this.http.post<any>(`${this.apiUrl}/login`, loginData).subscribe({
      next: (response) => {
        console.log('📥 Réponse du login:', response);

        // Vérifier si le token est présent dans la réponse
        if (response && response.token) {
          console.log('✅ Token reçu:', response.token.substring(0, 30) + '...');

          // IMPORTANT: Sauvegarder le token dans localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('userstatus', 'connected');

          // Sauvegarder les informations de l'utilisateur si nécessaire
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }

          console.log('💾 Token sauvegardé dans localStorage');
          this.router.navigate(['/home']);

          // Afficher un message de succès
          Swal.fire({
            icon: 'success',
            title: 'Connexion réussie',
            text: `Bienvenue ${response.user?.nom || 'utilisateur'} !`,
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          // Réponse inattendue
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Réponse du serveur invalide.',
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors de la connexion', error);

        // Gérer les différents types d'erreurs
        let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

        if (error.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect!';
        } else if (error.status === 422) {
          // Erreur de validation
          if (error.error && error.error.errors) {
            const errors = error.error.errors;
            errorMessage = Object.values(errors).flat().join('\n');
          } else {
            errorMessage = 'Données invalides. Veuillez vérifier vos informations.';
          }
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    });
  }
}
