import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MOCK_MOVIES } from '../../../mock/mock-movies';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import {NowShowingMoviesComponent} from '../now-showing-movies/now-showing-movies.component';
import {MovieCardComponent} from '../../home/card-movie/movie-card.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { Router } from '@angular/router';
@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  imports: [CommonModule, NowShowingMoviesComponent, NgxPaginationModule],
  standalone: true,
  providers: [DatePipe]
})
export class MovieDetailComponent implements OnInit {
  movie: any;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe, // Khai báo DatePipe trong constructor
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const movieId = paramMap.get('id');
      this.movie = MOCK_MOVIES.find(m => m.id === movieId);
    });
  }
  get actorList(): string[] {
    return this.movie.actors
      .split(',')
      .map((actor: string) => actor.trim());
  }

  getFormattedDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy')!;
  }
  allMovies = MOCK_MOVIES;
  goToDetail(movie: any) {
    this.router.navigate(['/movie', movie.id]);
  }
}
