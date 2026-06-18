import { Routes } from '@angular/router';
import { AppShellComponent } from './layouts/shell/app-shell/app-shell.component';
import { authGuard } from './core/auth/auth.guard';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: '',
    component: AppShellComponent,
     canActivate:[authGuard],
     children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'clients',loadComponent: () => import('./features/clients/pages/clients-list/clients-list.component').then(m => m.ClientsListComponent) },
      { path: 'clients/:id',loadComponent: () => import('./features/clients/pages/client-detail/client-detail.component').then(m => m.ClientDetailComponent) },
      { path: 'factures', loadComponent: () => import('./features/factures/pages/factures-list/factures-list.component').then(m => m.FacturesListComponent) },
      { path: 'factures/new', loadComponent: () => import('./features/factures/pages/facture-create/facture-create.component').then(m => m.FactureCreateComponent) },
      { path: 'factures/:id', loadComponent: () => import('./features/factures/pages/facture-detail/facture-detail.component').then(m => m.FactureDetailComponent) },
      { path: 'transactions', loadComponent: () => import('./features/transactions/pages/transactions-list/transactions-list.component').then(m => m.TransactionsListComponent) },
      { path: 'dettes', loadComponent: () => import('./features/dettes/pages/dettes-list/dettes-list.component').then(m => m.DettesListComponent) },
      { path: 'cloture', loadComponent: () => import('./features/cloture/pages/cloture-page/cloture-page.component').then(m => m.CloturePageComponent)},
      { path: 'bilans', loadComponent: () => import('./features/bilans/pages/bilans-page/bilans-page.component').then(m => m.BilansPageComponent) },
      { path: 'statistiques', loadComponent: () => import('./features/bilans/pages/statistiques-page/statistiques-page.component').then(m => m.StatistiquesPageComponent) },
      { path: 'notifications', loadComponent: () => import('./features/notifications/pages/notifications-list/notifications-list.component').then(m => m.NotificationsListComponent) },
      { path: 'produits', loadComponent: () => import('./features/produits/pages/produits-list/produits-list.component').then(m => m.ProduitsListComponent)},
      { path: 'fournisseurs', loadComponent: () => import('./features/fournisseurs/pages/fournisseurs-list/fournisseurs-list.component').then(m => m.FournisseursListComponent)},
      { path: 'livreurs', loadComponent: () => import('./features/livreurs/pages/livreurs-list/livreurs-list.component').then(m => m.LivreursListComponent)},
      { path: 'poissonneries', loadComponent: () => import('./features/admin/pages/poissonneries-list/poissonneries-list.component').then(m => m.PoissonneriesListComponent) },
      { path: 'equipe', loadComponent: () => import('./features/admin/pages/equipe-list/equipe-list.component').then(m => m.EquipeListComponent) },
      { path: 'recapitulatifs', loadComponent: () => import('./features/bilans/pages/recapitulatif-page/recapitulatif-page.component').then(m => m.RecapitulatifPageComponent) },
      { path: 'audit', loadComponent: () => import('./features/admin/pages/audit-list/audit-list.component').then(m => m.AuditListComponent) },
      { path: 'backup', loadComponent: () => import('./features/admin/pages/backup-page/backup-page.component').then(m => m.BackupPageComponent) },
    ]
   },

   //Fallback route - redirige vers login si aucune route ne correspond
  { path: '**', redirectTo: 'login' }


];
