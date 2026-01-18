import { Routes } from '@angular/router';
import { Login } from './auth/pages/login/login';
import { CreatePassword } from './auth/pages/create-password/create-password';
import { RecoverPassword } from './auth/pages/recover-password/recover-password';
import { Dashboard } from './dashboard/pages/dashboard/dashboard';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', component: Login },
  { path: 'cadastro', component: CreatePassword },
  { path: 'recuperar-senha', component: RecoverPassword },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' },
];
