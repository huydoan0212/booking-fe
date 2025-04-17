import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../card-movie/movie-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MOCK_MOVIES } from '../../../../mock/mock-movies';
import { Router } from '@angular/router';
@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, NgxPaginationModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent {
  constructor(private router: Router) {}
  activeTab: string = 'dangChieu';
  page = 1;
  allMovies = MOCK_MOVIES;

  get movies() {
    const today = new Date();

    if (this.activeTab === 'dangChieu') {
      return this.allMovies.filter((movie) => {
        const start = new Date(movie.startDate);
        const end = new Date(movie.endDate);
        return start <= today && end >= today;
      });
    }

    if (this.activeTab === 'sapChieu') {
      return this.allMovies.filter((movie) => {
        const start = new Date(movie.startDate);
        return start > today;
      });
    }

    if (this.activeTab === 'imax') {
      // ví dụ giả sử phim IMAX có flag riêng, nếu không có thì lọc theo slug chứa "imax" hoặc danh mục
      return this.allMovies.filter((movie) =>
        movie.categories?.some((cat: string) => cat.toLowerCase().includes('imax'))
      );
    }

    return this.allMovies;
  }
  goToDetail(movie: any) {
    this.router.navigate(['/movie', movie.id]);
  }
}
