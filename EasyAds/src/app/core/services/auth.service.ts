import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL de ton backend Laravel
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
 
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }

  
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  logout() {
    localStorage.removeItem('token');  // supprimer token
    this.router.navigate(['/login']);  // rediriger
  }
}
