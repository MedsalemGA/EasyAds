import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailVerificationService } from '../../../core/services/email-verification.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  email: string = '';
  code: string = '';
  isLoading: boolean = false;
  isResending: boolean = false;
  countdown: number = 60;
  canResend: boolean = false;
  private countdownInterval: any;

  constructor(
    private verificationService: EmailVerificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'email depuis les paramètres de route
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      if (!this.email) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Email manquant. Veuillez vous réinscrire.',
        }).then(() => {
          this.router.navigate(['/register']);
        });
      }
    });

    // Démarrer le compte à rebours
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown(): void {
    this.canResend = false;
    this.countdown = 60;
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  onVerify(): void {
    if (!this.code || this.code.length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Code invalide',
        text: 'Veuillez entrer un code à 6 chiffres.',
      });
      return;
    }

    this.isLoading = true;

    this.verificationService.verifyEmail(this.email, this.code).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Sauvegarder le token et les informations utilisateur
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('userstatus', 'connected');
          
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }

          // Afficher un message de succès
          Swal.fire({
            icon: 'success',
            title: 'Email vérifié !',
            text: 'Votre compte a été activé avec succès.',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/home']);
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur de vérification', error);
        
        let errorMessage = 'Une erreur est survenue.';
        
        if (error.status === 400) {
          errorMessage = 'Code invalide ou expiré. Veuillez réessayer.';
        } else if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
        });
      }
    });
  }

  onResendCode(): void {
    if (!this.canResend) {
      return;
    }

    this.isResending = true;

    this.verificationService.resendVerificationCode(this.email).subscribe({
      next: (response) => {
        this.isResending = false;
        this.code = ''; // Réinitialiser le code
        this.startCountdown(); // Redémarrer le compte à rebours
        
        Swal.fire({
          icon: 'success',
          title: 'Code renvoyé',
          text: 'Un nouveau code a été envoyé à votre email.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        this.isResending = false;
        console.error('Erreur lors du renvoi', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de renvoyer le code. Veuillez réessayer.',
        });
      }
    });
  }
}

