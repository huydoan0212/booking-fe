import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 thêm cái này
import { TicketService } from '../../../service/ticket/api/ticket.service';
import { TicketApi } from '../../../service/ticket/model/ticket.model';
import { TicketSummaryComponent } from '../../shared/ui/components/ticket-summary/ticket-summary.component'; // 👈 đúng path thì giữ nguyên

@Component({
  selector: 'app-seat-booking',
  standalone: true,
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.css'],
  imports: [
    CommonModule, // 👈 cần để dùng *ngFor, *ngIf,...
    TicketSummaryComponent, // 👈 nếu bạn đang dùng <app-ticket-summary>
  ],
})
export class SeatBookingComponent implements OnInit {
  private ticketService = inject(TicketService);
  showtimes: string[] = ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM'];
  rows: string[] = ['L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  seatsPerRow: number[] = Array(14).fill(0).map((_, i) => i + 1);

  seats: { row: string; seatNumber: number; status: 'AVAILABLE' | 'BOOKED' }[] = [];
  selectedSeats: { row: string; seatNumber: number }[] = [];

  showtimeId: string = 'b5f0b94b-2b39-4591-b7f2-d0eaa39d6b88'; // TODO: thay bằng ID thực tế

  ngOnInit() {
    this.loadSeats();
  }
  isSeatBooked(row: string, seatNumber: number): boolean {
    const seat = this.seats.find(s => s.row === row && s.seatNumber === seatNumber);
    return seat?.status === 'BOOKED';
  }


  loadSeats() {
    // Bước 1: tạo tất cả ghế mặc định là AVAILABLE
    this.seats = [];
    this.rows.forEach(row => {
      this.seatsPerRow.forEach(seatNumber => {
        this.seats.push({
          row,
          seatNumber,
          status: 'AVAILABLE',
        });
      });
    });

    // Bước 2: gọi API để lấy danh sách ticket đã đặt
    this.ticketService.getTicketByShowTimeId(this.showtimeId).subscribe({
      next: (tickets: TicketApi.Response[]) => {
        tickets.forEach(ticket => {
          const bookedSeat = ticket.seat;
          const seat = this.seats.find(s => s.row === bookedSeat.seatRow && s.seatNumber === bookedSeat.seatColumn);
          if (seat) {
            seat.status = 'BOOKED'; // ✅ sửa logic cập nhật trạng thái ghế
          }
        });
      },
      error: (err) => {
        console.error('Failed to load booked tickets', err);
      }
    });
  }

  selectTime(time: string) {
    // Khi chọn suất chiếu khác, bạn có thể cập nhật lại `showtimeId` và gọi lại `loadSeats()`
  }
}
