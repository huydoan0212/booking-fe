import {Component} from '@angular/core';
import {MovieCardComponent} from '../card-movie/movie-card.component';
// @ts-ignore
@Component({
  selector: 'app-movie-listing',
  templateUrl: './movie-listing.component.html',
  styleUrls: ['./movie-listing.component.css'],
  standalone: true
})
interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  rating: number;
  ageRating: string;
}
export class MovieListingComponent {
  movies: Movie[] = [];
  ngOnInit() {
    this.movies = [
      {
        id: 1,
        title: 'Địa đạo mặt trời trong bóng tối',
        posterUrl: '/assets/images/movie.png',
        rating: 8.7,
        ageRating: 'T16'
      },
      {
        id: 2,
        title: 'Con nhà người ta',
        posterUrl: '/assets/images/movie.png',
        rating: 7.9,
        ageRating: 'T13'
      },
      {
        id: 3,
        title: 'Quỷ cẩu',
        posterUrl: '/assets/images/movie.png',
        rating: 8.2,
        ageRating: 'T18'
      },
      {
        id: 4,
        title: 'Em và Trịnh',
        posterUrl: '/assets/images/movie.png',
        rating: 8.5,
        ageRating: 'T13'
      }
    ];
  }
}
