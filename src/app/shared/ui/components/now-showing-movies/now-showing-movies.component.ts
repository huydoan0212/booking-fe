import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-now-showing-movies',
  templateUrl: './now-showing-movies.component.html',
  styleUrls: ['./now-showing-movies.component.css'],
  standalone: true
})
export class NowShowingMoviesComponent {
  @Input() movie: any;
  constructor(private router: Router) {
  } // Inject Router vào constructor
  // Phương thức này sẽ chuyển hướng đến trang chi tiết của bộ phim
  async goToMovie(id: number) {
    const success = await this.router.navigate(['/movie', id]);
    if (success) {
      console.log('Navigation thành công');
    } else {
      console.error('Navigation thất bại');
    }
  }

}
