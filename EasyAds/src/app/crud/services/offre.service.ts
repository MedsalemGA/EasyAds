import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Offre {
  id?: number;
  user_id?: number;
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  wilaya: string;
  commune?: string;
  etat: string;
  statut?: string;
  images?: string[];
  numde_telephone: string;
  vues?: number;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    nom: string;
    adressemail: string;
    numde_telephone?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Créer une nouvelle offre
  createOffre(formData: FormData): Observable<any> {
    console.log('📤 Envoi de l\'offre au backend...');
    return this.http.post(`${this.apiUrl}/offres`, formData);
  }

  // Récupérer toutes les offres actives
  getAllOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/offres`);
  }

  // Récupérer une offre par ID
  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}/offres/${id}`);
  }

  // Récupérer les offres de l'utilisateur connecté
  getMyOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/my-offres`);
  }

  // Mettre à jour une offre
  updateOffre(id: number, data: Partial<Offre>): Observable<any> {
    return this.http.put(`${this.apiUrl}/offres/${id}`, data);
  }

  // Supprimer une offre
  deleteOffre(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/offres/${id}`);
  }
}

