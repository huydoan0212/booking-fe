import { Component, inject, OnInit } from '@angular/core';
import { MovieApi } from '../../../../service/movie/model/movie.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../../service/movie/api/movie.service';
import { MovieCardComponent } from '../../../shared/ui/components/card-movie/movie-card.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.scss'],
  standalone: true,
  imports: [
    MovieCardComponent,
    NgForOf,
    NgIf
  ]
})
export class SearchMovieComponent implements OnInit {
  movies: MovieApi.Response[] = [];
  name: string = '';
  page: number = 1;
  take: number = 10;
  sortDirection: string = 'ASC';

  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      this.name = query?.trim() || '';

      if (this.name) {
        this.getMovies(this.name, this.page, this.take, this.sortDirection);
      }
    });
  }

  getMovies(name: string, page: number, take: number, sortDirection: string): void {
    this.movieService.searchMovies(name, page, take, sortDirection)
      .subscribe({
        next: (res: any) => {
          this.movies = res.responseData.rows;
          console.log('Kết quả tìm kiếm:', this.movies);
        },
        error: (err) => {
          console.error('Lỗi khi tải phim:', err);
        }
      });
  }

  goToDetail(movie: MovieApi.Response): void {
    this.router.navigate(['/movie', movie.id]);
  }
}
