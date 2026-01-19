import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OffreService } from '../../../crud/services/offre.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-annonce-details',
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './annonce-details.component.html',
  styleUrl: './annonce-details.component.css'
})
export class AnnonceDetailsComponent implements OnInit {
  offre: any = null;
  loading: boolean = true;
  error: string = '';
  currentImageIndex: number = 0;
  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOffre(+id);
    }
  }

  loadOffre(id: number): void {
    this.loading = true;
    this.offreService.getOffreById(id).subscribe({
      next: (data) => {
        this.offre = data;
        this.loading = false;

        // Vérifier si l'utilisateur est le propriétaire
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        this.isOwner = currentUser.id === data.user_id;

        console.log('✅ Offre chargée:', data);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement de l\'offre:', error);
        this.error = 'Impossible de charger l\'offre';
        this.loading = false;
      }
    });
  }

  nextImage(): void {
    if (this.offre?.images && this.offre.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.offre.images.length;
    }
  }

  previousImage(): void {
    if (this.offre?.images && this.offre.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.offre.images.length - 1
        : this.currentImageIndex - 1;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  editOffre(): void {
    this.router.navigate(['/modifier', this.offre.id]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  callPhone(): void {
    if (this.offre?.numde_telephone) {
      window.location.href = `tel:${this.offre.numde_telephone}`;
    }
  }

  shareOffre(): void {
    if (navigator.share) {
      navigator.share({
        title: this.offre.titre,
        text: this.offre.description,
        url: window.location.href
      }).catch(err => console.log('Erreur de partage:', err));
    } else {
      // Copier le lien dans le presse-papier
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  }
}
