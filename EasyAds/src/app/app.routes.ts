import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { AnnonceCreateComponent } from './features/annonces/annonce-create/annonce-create.component';
import { AnnonceDetailsComponent } from './features/annonces/annonce-details/annonce-details.component';
import { AnnonceEditComponent } from './features/annonces/annonce-edit/annonce-edit.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AnnoncesLisComponent } from './features/annonces/annonces-lis/annonces-lis.component';
import { MonCompteComponent } from './features/moncompte/mon-compte/mon-compte.component';
import { ForgotpasswordComponent } from './features/auth/forgotpassword/forgotpassword.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'annonces', component: AnnoncesLisComponent },
  { path: 'annonce/:id', component: AnnonceDetailsComponent },
  { path: 'publier', component: AnnonceCreateComponent, canActivate: [AuthGuard] },
  { path: 'modifier/:id', component: AnnonceEditComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'mon-compte', component: MonCompteComponent },
  {path:  'forgotpassword',component:ForgotpasswordComponent},
  
  { path: '**', redirectTo: '' }
];
