import { Component } from '@angular/core';
import{Router, RouterLink} from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent  {
isOpen = false;
activeuser: string | null = '';
  

constructor( private router: Router) {
  this.activeuser = localStorage.getItem('userstatus');
}


toggleDropdown() {
  this.isOpen = !this.isOpen;
}
publier(){
  if(this.activeuser == null){
    Swal.fire({
      title: 'Vous devez être connecté pour publier une annonce',
      icon: 'warning',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate(['/login']);
    });
    
  }
  console.log('activeuser',this.activeuser);
  this.router.navigate(['/publier']);
}
logout() {
  Swal.fire({
    title: 'Are you sure you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout!'
  }).then((result) => {
    if (result.isConfirmed) {
          localStorage.removeItem('userstatus');
          localStorage.removeItem('token');
          this.activeuser = null;
          this.router.navigate(['/login']);
          Swal.fire('Logout', 'You have been logged out.', 'success');
    }
  });

}
}
