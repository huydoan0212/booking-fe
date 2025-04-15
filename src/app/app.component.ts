import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './+shell/ui/header/header.component';
import {HttpClient} from '@angular/common/http';
import {SlideComponent} from './component/home/slide/slide.component';
import {QuickBookingComponent} from './component/home/quick-booking/quick-booking.component';
import {MovieCardComponent} from './component/home/card-movie/movie-card.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SlideComponent, QuickBookingComponent, MovieCardComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'booking-fe';
}
