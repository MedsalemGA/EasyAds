import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MonCompteService } from '../../../crud/services/mon-compte.service';
import { User } from '../../../core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mon-compte',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './mon-compte.component.html',
  styleUrl: './mon-compte.component.css'
})
export class MonCompteComponent implements OnInit {
  // User data
  username: string = '';
  email: string = '';
  phone: string = '';
  wilaya: string = '';
  role: string = '';
  alertMessage = '';
  annonces: any[] = [];
  color='';
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

  // Original data for cancel functionality
  private originalData: any = {};

  // Password change
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // UI state
  activeTab: string = 'profile';
  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private monCompteService: MonCompteService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('🔵 Mon Compte - ngOnInit');
    this.getMyOffres();

    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    console.log('🔍 Token dans localStorage:', token ? 'PRÉSENT (' + token.substring(0, 30) + '...)' : 'ABSENT');

    if (!token) {
      console.log('❌ Pas de token - redirection vers login');
      Swal.fire({
        icon: 'warning',
        title: 'Non connecté',
        text: 'Vous devez être connecté pour accéder à cette page.',
        confirmButtonColor: '#667eea'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    console.log('✅ Token trouvé - chargement des infos utilisateur');
    this.loadUserInfo();
  }

  // Charger les informations de l'utilisateur
  loadUserInfo() {
    console.log('📡 Appel de getallinfo()...');
    this.isLoading = true;
    this.monCompteService.getallinfo().subscribe({
      next: (response: User) => {
        console.log('✅ Réponse reçue:', response);
        this.username = response.nom;
        this.email = response.adressemail;
        this.phone = response.numde_telephone;
        this.wilaya = response.wilaya;
        this.role = response.role;

        // Sauvegarder les données originales
        this.saveOriginalData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des informations', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Error object:', error.error);
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger vos informations. Veuillez vous reconnecter.',
          confirmButtonColor: '#667eea'
        }).then(() => {
          // Rediriger vers la page de connexion si non authentifié
          if (error.status === 401) {
            console.log('🔄 Erreur 401 - suppression du token et redirection');
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  // Sauvegarder les données originales
  saveOriginalData() {
    this.originalData = {
      username: this.username,
      email: this.email,
      phone: this.phone,
      wilaya: this.wilaya
    };
  }

  // Activer le mode édition
  enableEditMode() {
    this.isEditMode = true;
  }

  // Annuler les modifications
  cancelEdit() {
    this.username = this.originalData.username;
    this.email = this.originalData.email;
    this.phone = this.originalData.phone;
    this.wilaya = this.originalData.wilaya;
    this.isEditMode = false;
  }

  // Mettre à jour le profil
  updateProfile() {
    // Validation
    if (!this.username || !this.email || !this.phone || !this.wilaya) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez remplir tous les champs',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Email invalide',
        text: 'Veuillez entrer une adresse email valide',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    this.isLoading = true;

    const updateData = {
      nom: this.username,
      adressemail: this.email,
      numde_telephone: this.phone,
      wilaya: this.wilaya
    };

    this.monCompteService.updateUserInfo(updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.isEditMode = false;
        this.saveOriginalData();

        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Vos informations ont été mises à jour avec succès',
          confirmButtonColor: '#667eea'
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la mise à jour', error);

        let errorMessage = 'Une erreur est survenue lors de la mise à jour';
        if (error.error && error.error.errors) {
          const errors = error.error.errors;
          errorMessage = Object.keys(errors).map(key => errors[key].join(', ')).join('\n');
        } else if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          confirmButtonColor: '#667eea'
        });
      }
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
   ontype(event: KeyboardEvent,password:string)
  {
    
   
    if(this.findmaj(this.newPassword)===false && this.findother(this.newPassword)===false){
      this.alertMessage='Votre mot de passe est tres faible!';
      this.color='red';
      return;
    }
    if(this.findmaj(this.newPassword)===true || this.findother(this.newPassword)===true ){
      this.alertMessage='Votre mot de passe est moyen';
      this.color='yellow'
    }
    if(this.findmaj(this.newPassword)===true && this.findother(this.newPassword)===true){
      this.alertMessage='Mot de passe fort!';
      this.color='green';
    }
  }

  // Changer le mot de passe
  changePassword() {
    // Validation
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez remplir tous les champs',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Vérifier que le nouveau mot de passe fait au moins 8 caractères
    if (this.newPassword.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Mot de passe trop court',
        text: 'Le mot de passe doit contenir au moins 8 caractères',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Vérifier que les mots de passe correspondent
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Mots de passe différents',
        text: 'Les mots de passe ne correspondent pas',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    this.isLoading = true;

    const passwordData = {
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmPassword
    };

    this.monCompteService.updateUserInfo(passwordData).subscribe({
      next: () => {
        this.isLoading = false;

        // Réinitialiser les champs
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Votre mot de passe a été modifié avec succès',
          confirmButtonColor: '#667eea'
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors du changement de mot de passe', error);

        let errorMessage = 'Une erreur est survenue lors du changement de mot de passe';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error && error.error.errors) {
          const errors = error.error.errors;
          errorMessage = Object.keys(errors).map(key => errors[key].join(', ')).join('\n');
        }

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  // Confirmer la suppression du compte
  confirmDeleteAccount() {
    Swal.fire({
      title: 'Êtes-vous absolument sûr ?',
      html: `
        <p style="margin-bottom: 1rem;">Cette action est <strong>irréversible</strong>.</p>
        <p style="margin-bottom: 1rem;">Toutes vos données seront définitivement supprimées :</p>
        <ul style="text-align: left; margin: 1rem 2rem;">
          <li>Vos annonces</li>
          <li>Votre historique</li>
          <li>Vos informations personnelles</li>
        </ul>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f56565',
      cancelButtonColor: '#4a5568',
      confirmButtonText: 'Oui, supprimer mon compte',
      cancelButtonText: 'Annuler',
      input: 'password',
      inputLabel: 'Entrez votre mot de passe pour confirmer',
      inputPlaceholder: 'Votre mot de passe',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      preConfirm: (password) => {
        if (!password) {
          Swal.showValidationMessage('Le mot de passe est requis');
          return false;
        }
        return password;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.deleteAccount(result.value);
      }
    });
  }

  // Supprimer le compte
  deleteAccount(password: string) {
    this.isLoading = true;

    this.monCompteService.deleteAccount({ password }).subscribe({
      next: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: 'Compte supprimé',
          text: 'Votre compte a été supprimé avec succès',
          confirmButtonColor: '#667eea',
          allowOutsideClick: false
        }).then(() => {
          // Nettoyer le localStorage et rediriger
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userstatus');
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la suppression du compte', error);

        let errorMessage = 'Une erreur est survenue lors de la suppression du compte';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          confirmButtonColor: '#667eea'
        });
      }
    });
  }
  getMyOffres() {
    this.monCompteService.getMyOffres().subscribe({
      next: (response) => {
        this.annonces = response;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des annonces', error);
      }
    });
  }
  editAnnonce(id: number) {
    this.router.navigate(['/modifier', id]);
  }
  deleteAnnonce(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.monCompteService.deleteAnnonce(id).subscribe({
          next: () => {
            this.getMyOffres();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression de l\'annonce', error);
          }
        });
      }
    });
   
  }
}
