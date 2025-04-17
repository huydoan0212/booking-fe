import { Routes } from '@angular/router';
import { HomeComponent } from './component/pages/home/home.component';
import {MovieDetailComponent} from './component/pages/movie-detail/movie-detail.component'
export const routes: Routes = [ // <- Thêm export ở đây
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'movie/:id', component: MovieDetailComponent },
];
