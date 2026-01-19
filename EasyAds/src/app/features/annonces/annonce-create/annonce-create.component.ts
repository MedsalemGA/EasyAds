import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffreService } from '../../../crud/services/offre.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-annonce-create',
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './annonce-create.component.html',
  styleUrl: './annonce-create.component.css'
})
export class AnnonceCreateComponent {
  // Données du formulaire
  titre: string = '';
  description: string = '';
  prix: number = 0;
  categorie: string = '';
  wilaya: string = '';
  commune: string = '';
  etat: string = 'bon';
  numde_telephone: string = '';
  images: File[] = [];
  imagePreviews: string[] = [];

  // Listes de sélection
  categories: string[] = [
    'Électronique',
    'Véhicules',
    'Immobilier',
    'Meubles',
    'Vêtements',
    'Sports & Loisirs',
    'Emploi',
    'Services',
    'Autres'
  ];

  wilayas: string[] = [
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
    "Zaghouan"
  ];

  etats: string[] = ['neuf', 'bon', 'moyen', 'usage'];

  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private offreService: OffreService
  ) {}

  
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      
      const maxImages = 5;
      const remainingSlots = maxImages - this.images.length;
      const filesToAdd = Math.min(files.length, remainingSlots);

      for (let i = 0; i < filesToAdd; i++) {
        const file = files[i];

       
        if (file.type.startsWith('image/')) {
          this.images.push(file);

          
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  
  removeImage(index: number): void {
    this.images.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

 
  onSubmit(): void {
    
    if (!this.titre || !this.description || !this.prix || !this.categorie ||
        !this.wilaya || !this.numde_telephone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.prix <= 0) {
      alert('Le prix doit être supérieur à 0');
      return;
    }

    if (this.images.length === 0) {
      alert('Veuillez ajouter au moins une image');
      return;
    }

    
    const formData = new FormData();
    formData.append('titre', this.titre);
    formData.append('description', this.description);
    formData.append('prix', this.prix.toString());
    formData.append('categorie', this.categorie);
    formData.append('wilaya', this.wilaya);
    formData.append('commune', this.commune);
    formData.append('etat', this.etat);
    formData.append('numde_telephone', this.numde_telephone);

    
    this.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    console.log('📤 Envoi de l\'offre au backend...');
    this.isSubmitting = true;

    
    this.offreService.createOffre(formData).subscribe({
      next: (response) => {
        console.log('✅ Offre créée avec succès:', response);
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Votre annonce a été publiée avec succès',
          confirmButtonColor: '#4F46E5'
        }).then(() => {
          this.router.navigate(['/home']);
        });
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Erreur lors de la création de l\'offre:', error);
        this.isSubmitting = false;

        if (error.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: 'Vous devez être connecté pour publier une annonce',
            confirmButtonColor: '#667eea'
          }).then(() => {
            this.router.navigate(['/login']);
          });
          this.router.navigate(['/login']);
        } else if (error.status === 422) {
          Swal.fire({
            icon: 'warning',
            title: 'Veuillez corriger les erreurs suivantes',
            text: JSON.stringify(error.error.errors),
            confirmButtonColor: '#667eea'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la publication de l\'annonce',
            confirmButtonColor: '#667eea'
          });
        }
      }
    });
  }

  // Annuler et retourner
  onCancel(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données seront perdues.')) {
      this.router.navigate(['/home']);
    }
  }
}
