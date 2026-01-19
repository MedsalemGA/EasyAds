import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UpdateUserRequest, DeleteAccountRequest } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MonCompteService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Récupérer les informations de l'utilisateur
  getallinfo(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getallinfo`);
  }

  // Mettre à jour les informations de l'utilisateur
  updateUserInfo(data: UpdateUserRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-user-info`, data);
  }

  // Supprimer le compte utilisateur
  deleteAccount(data: DeleteAccountRequest): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-account`, {
      body: data
    });
  }
  getMyOffres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-offres`);
  }
  editAnnonce(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/offres/${id}`, data);
  }
  deleteAnnonce(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/offres/${id}`);
  }
}
