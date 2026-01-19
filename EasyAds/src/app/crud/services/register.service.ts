import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(userData: any): void {
    // Préparer les données pour le backend
    const registerData = {
      nom: userData.name,
      adressemail: userData.email,
      password: userData.password,
      numde_telephone: userData.phone,
      wilaya: userData.wilaya,
      role: userData.role || 'client'
    };

    this.http.post<any>(`${this.apiUrl}/register`, registerData).subscribe({
      next: (response) => {
        console.log('Réponse inscription:', response);

        if (response.requires_verification) {
          // Afficher un message de succès
          Swal.fire({
            icon: 'success',
            title: 'Compte créé !',
            html: `
              <p>Votre compte a été créé avec succès.</p>
              <p class="mt-2">Un code de vérification a été envoyé à :</p>
              <p class="font-bold text-indigo-600">${response.email}</p>
            `,
            confirmButtonText: 'Vérifier maintenant',
            confirmButtonColor: '#4F46E5'
          }).then(() => {
            // Rediriger vers la page de vérification avec l'email
            this.router.navigate(['/verify-email'], {
              queryParams: { email: response.email }
            });
          });
        } else {
          // Cas où la vérification n'est pas requise (ne devrait pas arriver)
          Swal.fire({
            icon: 'success',
            title: 'Inscription réussie',
            text: 'Vous pouvez maintenant vous connecter.',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription', error);

        let errorMessage = 'Une erreur est survenue lors de l\'inscription.';

        if (error.status === 422) {
          // Erreurs de validation
          if (error.error && error.error.errors) {
            const errors = error.error.errors;
            const errorList = Object.keys(errors)
              .map(key => errors[key].join('<br>'))
              .join('<br>');
            errorMessage = errorList;
          }
        } else if (error.status === 500) {
          errorMessage = error.error?.error || 'Erreur serveur. Veuillez réessayer.';
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Erreur d\'inscription',
          html: errorMessage,
        });
      }
    });
  }
}
