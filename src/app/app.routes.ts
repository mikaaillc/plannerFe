import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { PlannersComponent } from './planners/planners.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'planners', component: PlannersComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'offer/:id', component: OfferDetailComponent },
  { path: '**', redirectTo: '' }
];
