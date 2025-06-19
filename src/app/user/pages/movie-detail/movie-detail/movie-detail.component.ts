import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import {NowShowingMoviesComponent} from '../../../../shared/ui/components/now-showing-movies/now-showing-movies.component';
import {MovieCardComponent} from '../../../../shared/ui/components/card-movie/movie-card.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { Router } from '@angular/router';
import {ShowtimesComponent} from '../showtimes/showtimes.component';
import {MovieService} from '../../../../../service/movie/api/movie.service';
import {Subject, takeUntil} from 'rxjs';
import {MovieApi} from '../../../../../service/movie/model/movie.model';
@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  imports: [CommonModule, NgxPaginationModule, ShowtimesComponent, NowShowingMoviesComponent],
  standalone: true,
  providers: [DatePipe]
})
export class MovieDetailComponent implements OnInit {

  private destroy$ = new Subject<void>();
  private readonly movieService = inject(MovieService);
  private readonly activatedRoute = inject(ActivatedRoute);
  constructor(
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovieId();
    this.getMovies();
  }

  movieDetail: MovieApi.Response | null = null;
  movies: MovieApi.Response[] = [];
  getMovieId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let movieID = p.get('id');
        this.getMovieDetails(movieID!)
      },
    });
  }

  getMovieDetails(id: string): void {
    this.movieService
      .getMovieDetail(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.movieDetail = res.responseData;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getMovies() {
    this.movieService.getMovies('name ~ \'*\'', 1, 6, 'name')
      .subscribe({
        next: (res: any) => {
          this.movies = res.responseData.rows;
        },
        error: (err) => {
          console.error('Error loading movies', err);
        }
      });
  }

  get actorList(): string[] {
    return this.movieDetail?.actors?.split(',') || [];
  }

  getFormattedDate(date: string | null | undefined): string {
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy') ?? '' : '';
  }

  goToDetail(movie: any) {
    this.router.navigate(['/movie', movie.id]);
  }

}
