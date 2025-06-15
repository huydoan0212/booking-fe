  import { Routes } from '@angular/router';
  import {SeatBookingComponent} from './pages/seat-selection/seat-booking.component';
  import {FoodComboSelectionComponent} from './pages/food-combo-selection/food-combo-selection.component';
  import {CheckoutComponent} from './pages/checkout/checkout.component';
  import {ProfileComponent} from './pages/profile/profile.component';
  import {SearchMovieComponent} from './pages/search-movie/search-movie.component';
  import {HomeComponent} from './pages/home/home/home.component';
  import {MovieDetailComponent} from './pages/movie-detail/movie-detail/movie-detail.component';
  import {MoviesByCategoryComponent} from './pages/movies-by-category/movies-by-category.component';
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
      path: 'seat-booking/:id',
      component: SeatBookingComponent,
    },
    {
      path: 'food-combo-selection',
      component: FoodComboSelectionComponent,
    },
    {
      path: 'check-out',
      component: CheckoutComponent,
    },
    {
      path: 'profile',
      component: ProfileComponent,
    },
    {
      path:'search',
      component: SearchMovieComponent,
    },
    {
      path:'movies-by-category/:id',
      component: MoviesByCategoryComponent,
    }

  ];
