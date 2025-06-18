import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './user/layout/user-layout/user-layout.component';
import {AuthGuard} from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./user/pages/home/home/home.component').then(m => m.HomeComponent),
        title: 'Trang chủ',
      },
      {
        path: 'movie/:id',
        loadComponent: () =>
          import('./user/pages/movie-detail/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
        title: 'Chi tiết',
      },
      {
        path: 'seat-booking/:id',
        loadComponent: () =>
          import('./user/pages/seat-selection/seat-booking.component').then(m => m.SeatBookingComponent),
        title: 'Đặt ghế',
        canActivate: [AuthGuard],
        data: { role: 'ROLE_USER' }
      },
      {
        path: 'food-combo-selection',
        loadComponent: () =>
          import('./user/pages/food-combo-selection/food-combo-selection.component').then(m => m.FoodComboSelectionComponent),
        title: 'Thức ăn',
      },
      {
        path: 'check-out',
        loadComponent: () =>
          import('./user/pages/checkout/checkout.component').then(m => m.CheckoutComponent),
        title: 'Thanh toán',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./user/pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Hồ sơ',
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./user/pages/search-movie/search-movie.component').then(m => m.SearchMovieComponent),
        title: 'Tìm kiếm',
      },
      {
        path: 'movies-by-category/:id',
        loadComponent: () =>
          import('./user/pages/movies-by-category/movies-by-category.component').then(m => m.MoviesByCategoryComponent),
        title: 'Thể Loại',
      },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard-management',
        pathMatch: 'full'
      },
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
  {
    path: '**',
    redirectTo: 'home',
  }
];
