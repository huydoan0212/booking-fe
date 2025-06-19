import { Component, inject, OnInit } from '@angular/core';
import { MovieApi } from '../../../../service/movie/model/movie.model';
import { MovieService } from '../../../../service/movie/api/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieCardComponent } from '../../../shared/ui/components/card-movie/movie-card.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-movies-by-category',
  templateUrl: './movies-by-category.component.html',
  imports: [
    MovieCardComponent,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./movies-by-category.component.scss']
})
export class MoviesByCategoryComponent implements OnInit {
  movies: MovieApi.Response[] = [];
  page: number = 1;
  take: number = 10;
  sortDirection: string = 'ASC';
  hasNextPage: boolean = false;
  categoryId: string = '';

  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoryId = id;
        this.page = 1;
        this.getMoviesByCategory(this.categoryId, this.page, this.take, this.sortDirection);
      }
    });
  }

  getMoviesByCategory(categoryId: string, page: number, take: number, sortDirection: string): void {
    this.movieService.getMoviesByCategory(categoryId, page, take, sortDirection)
      .subscribe({
        next: (res: any) => {
          this.movies = res.responseData.rows;
          this.hasNextPage = res.responseData.rows.length === this.take;
          console.log('Kết quả tìm kiếm:', this.movies);
        },
        error: (err) => {
          console.error('Lỗi khi tải phim:', err);
        }
      });
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getMoviesByCategory(this.categoryId, this.page, this.take, this.sortDirection);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.page++;
      this.getMoviesByCategory(this.categoryId, this.page, this.take, this.sortDirection);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToDetail(movie: MovieApi.Response): void {
    this.router.navigate(['/movie', movie.id]);
  }
}
