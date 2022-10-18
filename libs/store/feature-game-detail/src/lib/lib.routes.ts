import { Route } from '@angular/router';
import { GameDetailComponent } from './game-detail/game-detail.component';

export const storeFeatureGameDetailRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: GameDetailComponent },
];
