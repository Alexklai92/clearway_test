import { Route } from '@angular/router';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';

export const routes: Route[] = [
  {
    path: '',
    component: DocumentViewerComponent,
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./document-view/document-view.component').then(
        (m) => m.DocumentViewComponent
      ),
  },
];
