import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stats {
  totalOffres: number;
  totalUsers: number;
  totalVues: number;
}

export interface CategoryStats {
  name: string;
  icon: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les offres actives
  getAllOffres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/offres`);
  }

  // Récupérer les statistiques
  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/stats`);
  }

  // Récupérer les statistiques par catégorie
  getCategoryStats(): Observable<CategoryStats[]> {
    return this.http.get<CategoryStats[]>(`${this.apiUrl}/category-stats`);
  }
}

