import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './+shell/ui/header/header.component';
import {HttpClient} from '@angular/common/http';
import {SlideComponent} from './component/pages/slide/slide.component';
import {QuickBookingComponent} from './component/pages/quick-booking/quick-booking.component';
import {MovieCardComponent} from './component/pages/card-movie/movie-card.component';
import {MovieListComponent} from './component/pages/movie-list/movie-list.component';
import {MovieDetailComponent} from './component/pages/movie-detail/movie-detail.component';
import {HomeComponent} from './component/pages/home/home.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'booking-fe';
}
