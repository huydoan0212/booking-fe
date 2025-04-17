import { Routes } from '@angular/router';
import { HomeComponent } from './component/pages/home/home/home.component';
import {MovieDetailComponent} from './component/pages/movie-detail/movie-detail.component'
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'movie/:id', component: MovieDetailComponent },
];
