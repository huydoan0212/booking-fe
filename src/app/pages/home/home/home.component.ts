import { Component } from '@angular/core';
import {SlideComponent} from '../slide/slide.component';
import {QuickBookingComponent} from '../quick-booking/quick-booking.component';
import {MovieListComponent} from '../movie-list/movie-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    SlideComponent,
    QuickBookingComponent,
    MovieListComponent
  ],
  standalone: true
})
export class HomeComponent {

}
