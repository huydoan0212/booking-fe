import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './+shell/ui/header/header.component';
import {HttpClient} from '@angular/common/http';
import {SlideComponent} from './component/home/slide/slide.component';
import {QuickTicketComponent} from './component/home/quickticket/quick-ticket.component';
import {MovieBookingComponent} from './component/home/quickticket/movie-booking.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SlideComponent, QuickTicketComponent, QuickTicketComponent, MovieBookingComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'booking-fe';
}
