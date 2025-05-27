import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {TicketSummaryComponent} from '../../shared/ui/components/ticket-summary/ticket-summary.component';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    TicketSummaryComponent,
  ],
})
export class SeatBookingComponent implements OnInit{
  showtimes: string[] = ['09:30', '11:30', '12:30', '14:00', '15:00'];
  selectTime(time: string) {

  }
  rows: string[] = ['L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  seatsPerRow: number[] = Array(14).fill(0).map((_, i) => i + 1);
  seats: { row: string; seatNumber: number; status: string }[] = [];
  selectedSeats: { row: string; seatNumber: number }[] = [];
  ngOnInit() {
    // Khởi tạo dữ liệu ghế
    this.rows.forEach(row => {
      this.seatsPerRow.forEach(seatNumber => {
        this.seats.push({
          row,
          seatNumber,
          status: 'AVAILABLE' // 'available', 'booked'
        });
      });
    });
  }


}
