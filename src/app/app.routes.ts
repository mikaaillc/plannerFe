import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { PlannersComponent } from './planners/planners.component';
import { ProfileComponent } from './profile/profile.component';
import { EntityProfileEditComponent } from './entity-profile-edit/entity-profile-edit.component';
import { EntityProfileViewComponent } from './entity-profile-view/entity-profile-view.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PricingComponent } from './pricing/pricing.component';
import { PartnerSearchComponent } from './partner-search/partner-search.component';
import { PartnerOffersComponent } from './partner-offers/partner-offers.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'planners', component: PlannersComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'partner-search', component: PartnerSearchComponent },
  { path: 'entity-profile', component: EntityProfileEditComponent },
  { path: 'entity/:id', component: EntityProfileViewComponent },
  { path: 'job-create', loadComponent: () => import('./job-create/job-create.component').then(m => m.JobCreateComponent) },
  { path: 'entity-jobs', loadComponent: () => import('./entity-jobs/entity-jobs.component').then(m => m.EntityJobsComponent) },
  { path: 'job-offers/:id', loadComponent: () => import('./job-offers/job-offers.component').then(m => m.JobOffersComponent) },
  { path: 'available-jobs', loadComponent: () => import('./planner-available-jobs/planner-available-jobs.component').then(m => m.PlannerAvailableJobsComponent) },
  { path: 'accepted-jobs', loadComponent: () => import('./planner-accepted-jobs/planner-accepted-jobs.component').then(m => m.PlannerAcceptedJobsComponent) },
  { path: 'job-detail/:id', loadComponent: () => import('./job-detail/job-detail.component').then(m => m.JobDetailComponent) },
  { path: 'offer-detail/:id', component: OfferDetailComponent },
  { path: 'partner-offers', component: PartnerOffersComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'subscribe', component: SubscriptionComponent },
  { path: '**', redirectTo: '' }


];
