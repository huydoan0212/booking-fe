import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './+shell/ui/header/header.component';
import {HttpClient} from '@angular/common/http';
import {SlideComponent} from './pages/home/slide/slide.component';
import {QuickBookingComponent} from './pages/home/quick-booking/quick-booking.component';
import {MovieCardComponent} from './pages/home/card-movie/movie-card.component';
import {MovieListComponent} from './pages/home/movie-list/movie-list.component';
import {MovieDetailComponent} from './pages/movie-detail/movie-detail/movie-detail.component';
import {HomeComponent} from './pages/home/home/home.component';



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
