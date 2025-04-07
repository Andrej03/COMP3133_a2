// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { AuthGuard } from './guards/auth.guards';

export const routes: Routes = [
  // Important: use exact matching for empty path
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'employees', 
    component: EmployeeListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employees/:id', 
    component: EmployeeDetailsComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: 'login' }
];