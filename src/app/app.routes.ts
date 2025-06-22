import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'view',
    loadChildren: () =>
      import('./document/document.routes').then((r) => r.routes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('@shared/components/not-found').then((c) => c.NotFoundComponent),
  },
];
