import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HomeService, CategoryStats } from '../../../crud/services/home.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, NavbarComponent, RouterLink, FooterComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Données
  offres: any[] = [];
  offresFiltered: any[] = [];
  categories: CategoryStats[] = [];

  // Stats
  totalOffres: number = 0;
  totalUsers: number = 0;
  totalVues: number = 0;

  // Filtres
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedWilaya: string = '';
  selectedEtat: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;

  wilayas: string[] = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
    "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef",
    "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul",
    "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tozeur",
    "Tataouine", "Tunis", "Zaghouan"
  ];

  etats: string[] = ['neuf', 'bon', 'moyen', 'usage'];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadOffres();
    this.loadStats();
    this.loadCategoryStats();
  }

  loadOffres(): void {
    this.homeService.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.offresFiltered = data;
        console.log('✅ Offres chargées:', data.length);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des offres:', error);
      }
    });
  }

  loadStats(): void {
    this.homeService.getStats().subscribe({
      next: (data) => {
        this.totalOffres = data.totalOffres;
        this.totalUsers = data.totalUsers;
        this.totalVues = data.totalVues;
        console.log('✅ Stats chargées:', data);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des stats:', error);
      }
    });
  }

  loadCategoryStats(): void {
    this.homeService.getCategoryStats().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('✅ Catégories chargées:', data);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des catégories:', error);
      }
    });
  }

  applyFilters(): void {
    this.offresFiltered = this.offres.filter(offre => {
      const matchSearch = !this.searchQuery ||
        offre.titre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        offre.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchCategory = !this.selectedCategory || offre.categorie === this.selectedCategory;
      const matchWilaya = !this.selectedWilaya || offre.wilaya === this.selectedWilaya;
      const matchEtat = !this.selectedEtat || offre.etat === this.selectedEtat;

      const matchMinPrice = !this.minPrice || offre.prix >= this.minPrice;
      const matchMaxPrice = !this.maxPrice || offre.prix <= this.maxPrice;

      return matchSearch && matchCategory && matchWilaya && matchEtat && matchMinPrice && matchMaxPrice;
    });

    console.log('🔍 Filtres appliqués:', this.offresFiltered.length, 'résultats');
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedWilaya = '';
    this.selectedEtat = '';
    this.minPrice = 0;
    this.maxPrice = 0;
    this.offresFiltered = this.offres;
  }

  filterByCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.applyFilters();
  }
}
