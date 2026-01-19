import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffreService } from '../../../crud/services/offre.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-annonce-edit',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './annonce-edit.component.html',
  styleUrl: './annonce-edit.component.css'
})
export class AnnonceEditComponent implements OnInit {
  offreId: number = 0;
  loading: boolean = true;

  // Données du formulaire
  titre: string = '';
  description: string = '';
  prix: number = 0;
  categorie: string = '';
  wilaya: string = '';
  commune: string = '';
  etat: string = '';
  numde_telephone: string = '';
  statut: string = '';

  // Images
  existingImages: string[] = [];
  newImages: File[] = [];
  imagePreviews: string[] = [];
  imagesToDelete: string[] = [];

  // Listes
  categories: string[] = [
    'Électronique', 'Véhicules', 'Immobilier', 'Meubles',
    'Vêtements', 'Sports & Loisirs', 'Services', 'Emploi', 'Autres'
  ];

  wilayas: string[] = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
    "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef",
    "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul",
    "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tozeur",
    "Tataouine", "Tunis", "Zaghouan"
  ];

  etats: string[] = ['neuf', 'bon', 'moyen', 'usage'];
  statuts: string[] = ['active', 'vendue', 'expiree', 'suspendue'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.offreId = +id;
      this.loadOffre();
    }
  }

  loadOffre(): void {
    this.loading = true;
    this.offreService.getOffreById(this.offreId).subscribe({
      next: (data) => {
        // Vérifier si l'utilisateur est le propriétaire
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id !== data.user_id) {
          Swal.fire('Erreur', 'Vous n\'êtes pas autorisé à modifier cette offre', 'error');
          this.router.navigate(['/']);
          return;
        }

        // Remplir le formulaire
        this.titre = data.titre;
        this.description = data.description;
        this.prix = data.prix;
        this.categorie = data.categorie;
        this.wilaya = data.wilaya;
        this.commune = data.commune || '';
        this.etat = data.etat;
        this.numde_telephone = data.numde_telephone;
        this.statut = data.statut || '';
        this.existingImages = data.images || [];

        this.loading = false;
        console.log('✅ Offre chargée pour édition:', data);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement de l\'offre:', error);
        Swal.fire('Erreur', 'Impossible de charger l\'offre', 'error');
        this.router.navigate(['/']);
      }
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    const totalImages = this.existingImages.length + this.newImages.length + files.length;

    if (totalImages > 5) {
      Swal.fire('Attention', 'Vous ne pouvez pas ajouter plus de 5 images au total', 'warning');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.newImages.push(file);

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeExistingImage(index: number): void {
    const imageToDelete = this.existingImages[index];
    this.imagesToDelete.push(imageToDelete);
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.newImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  onSubmit(): void {
    // Validation
    if (!this.titre || !this.description || !this.prix || !this.categorie ||
        !this.wilaya || !this.etat || !this.numde_telephone) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const totalImages = this.existingImages.length + this.newImages.length;
    if (totalImages === 0) {
      Swal.fire('Erreur', 'Veuillez ajouter au moins une image', 'error');
      return;
    }

    // Convert File objects to FormData for proper handling
    const formData = new FormData();
    formData.append('titre', this.titre);
    formData.append('description', this.description);
    formData.append('prix', this.prix.toString());
    formData.append('categorie', this.categorie);
    formData.append('wilaya', this.wilaya);
    formData.append('commune', this.commune);
    formData.append('etat', this.etat);
    formData.append('numde_telephone', this.numde_telephone);
    formData.append('statut', this.statut);
    formData.append('existing_images', JSON.stringify(this.existingImages));
    formData.append('images_to_delete', JSON.stringify(this.imagesToDelete));

    // Add new image files
    this.newImages.forEach((file) => {
      formData.append('images', file);
    });

    // Envoyer la requête
    this.offreService.updateOffre(this.offreId, formData as any).subscribe({
      next: (response) => {
        console.log('✅ Offre mise à jour:', response);
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Votre annonce a été mise à jour avec succès',
          confirmButtonColor: '#4F46E5'
        }).then(() => {
          this.router.navigate(['/annonce', this.offreId]);
        });
      },
      error: (error) => {
        console.error('❌ Erreur lors de la mise à jour:', error);
        Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour', 'error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/annonce', this.offreId]);
  }
}
