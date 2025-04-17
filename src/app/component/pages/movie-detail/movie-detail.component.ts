import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MOCK_MOVIES } from '../../../mock/mock-movies';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  imports: [CommonModule],
  standalone: true,
  providers: [DatePipe]
})
export class MovieDetailComponent implements OnInit {
  movie: any;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe // Khai báo DatePipe trong constructor
  ) {}

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    this.movie = MOCK_MOVIES.find(m => m.id === movieId);
  }

  get actorList(): string[] {
    return this.movie.actors
      .split(',')
      .map((actor: string) => actor.trim());
  }

  getFormattedDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy')!;
  }
}
