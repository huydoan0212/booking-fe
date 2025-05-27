import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import {MovieDetailComponent} from './pages/movie-detail/movie-detail/movie-detail.component'
import {SeatBookingComponent} from './pages/seat-selection/seat-booking.component';
import {FoodComboSelectionComponent} from './pages/food-combo-selection/food-combo-selection.component';
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
  { path: 'movie/:id',
    component: MovieDetailComponent },
  {
    path: 'seat-booking',
    component: SeatBookingComponent,
  },
  {
    path: 'food-combo-selection',
    component: FoodComboSelectionComponent,
  }

];
