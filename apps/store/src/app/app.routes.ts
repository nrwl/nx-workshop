import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'game/:id',
    loadChildren: () =>
      import('@bg-hoard/store/feature-game-detail').then(
        (m) => m.StoreFeatureGameDetailModule
      ),
  },
];
