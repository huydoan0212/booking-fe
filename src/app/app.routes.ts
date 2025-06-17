import { Routes } from '@angular/router';
import { SeatBookingComponent } from './pages/seat-selection/seat-booking.component';
import { FoodComboSelectionComponent } from './pages/food-combo-selection/food-combo-selection.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchMovieComponent } from './pages/search-movie/search-movie.component';
import { HomeComponent } from './pages/home/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail/movie-detail.component';
import { MoviesByCategoryComponent } from './pages/movies-by-category/movies-by-category.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout.component';

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
  {
    path: 'movie/:id',
    component: MovieDetailComponent,
  },
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
    path: 'search',
    component: SearchMovieComponent,
  },
  {
    path: 'movies-by-category/:id',
    component: MoviesByCategoryComponent,
  },


  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'cinema-management',
        loadComponent: () =>
          import('./admin/pages/cinema-management/cinema-list/cinema-list.component').then(m => m.CinemaListComponent),
        title: 'Quản lý rạp phim',
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./admin/pages/user-management/user-list/user-list.compoent').then(m => m.UserListComponent),
        title: 'Quản lý người dùng',
      },
      {
        path: 'movie-management',
        loadComponent: () =>
          import('./admin/pages/movie-management/movie-list/movie-list.component').then(m => m.MovieListComponent),
        title: 'Quản lý Phim',
      },
      {
        path: 'category-management',
        loadComponent: () =>
          import('./admin/pages/category-management/category-list/category-list.component').then(m => m.CategoriesListComponent),
        title: 'Quản lý Thể Loại',
      },
      {
        path: 'dashboard-management',
        loadComponent: () =>
          import('./admin/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Thống kê',
      },
    ],
  },

];
