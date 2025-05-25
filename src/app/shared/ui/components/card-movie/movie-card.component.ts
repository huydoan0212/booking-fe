import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie: any;
  constructor(private router: Router) {} // Inject Router vào constructor
  // Phương thức này sẽ chuyển hướng đến trang chi tiết của bộ phim
  goToMovieDetail(movieId: string) {
    this.router.navigate(['/movie', movieId]); // Chuyển hướng đến route chi tiết phim
  }
}
