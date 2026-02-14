import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'raw-material/list'
      },
      {
        path: 'raw-material/list',
        loadComponent: () =>
          import('./features/raw-material/pages/raw-material-list/raw-material-list.component')
            .then(m => m.RawMaterialListComponent),
        title: 'Matéria-prima | Lista',
      },
      {
        path: 'raw-material/new',
        loadComponent: () =>
          import('./features/raw-material/pages/raw-material-form/raw-material-form.component')
            .then(m => m.RawMaterialFormComponent),
        title: 'Matéria-prima | Nova',
      },
      {
        path: 'raw-material/edit/:id',
        loadComponent: () =>
          import('./features/raw-material/pages/raw-material-form/raw-material-form.component')
            .then(m => m.RawMaterialFormComponent),
        title: 'Matéria-prima | Editar',
      },

      {
        path: 'product/list',
        loadComponent: () =>
          import('./features/product/pages/product-list/product-list.component')
            .then(m => m.ProductListComponent),
        title: 'Produto | Lista',
      },
      {
        path: 'product/new',
        loadComponent: () =>
          import('./features/product/pages/product-form/product-form.component')
            .then(m => m.ProductFormComponent),
        title: 'Produto | Novo',
      },
      {
        path: 'product/edit/:id',
        loadComponent: () =>
          import('./features/product/pages/product-form/product-form.component')
            .then(m => m.ProductFormComponent),
        title: 'Produto | Editar',
      },

      {
        path: 'production/suggestion',
        loadComponent: () =>
          import('./features/production/pages/production-suggestion/production-suggestion.component')
            .then(m => m.ProductionSuggestionComponent),
        title: 'Sugestão de Produção',
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
