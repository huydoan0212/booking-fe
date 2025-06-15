import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, Routes} from '@angular/router';
import {TicketService} from '../../../service/ticket/api/ticket.service';
import {LockTicket, TicketApi} from '../../../service/ticket/model/ticket.model';
import {StompService} from '../../service/stomp.service';
import {CommonModule} from '@angular/common';
import {TicketSummaryComponent} from '../../shared/ui/components/ticket-summary/ticket-summary.component';
import {Message} from '@stomp/stompjs';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  standalone: true,
  styleUrls: ['./seat-booking.component.scss'],
  imports: [CommonModule, TicketSummaryComponent]
})
export class SeatBookingComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  userId = '79d8db34-7d87-4d7e-a5f1-af6b87f49c65';
  showtimeId!: string;

  // Danh sách vé lấy từ backend
  tickets: TicketApi.Response[] = [];

  // Map ticketId → trạng thái: "BOOKED" | "AVAILABLE" | "LOCKED" | "LOCKED_BY_ME"
  seatStatusMap: Record<string, { status: string; lockedBy?: string }> = {};

  holdInitialized = false;
  mySelected: Set<string> = new Set<string>();

  // Các hàng (rows)
  rows: string[] = ['L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

  constructor(
    private ticketService: TicketService,
    private stompService: StompService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadTickets();
    this.connectWebSocket();
// 1. Lấy showtimeId từ URL trước
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.showtimeId = id;
        // 2. Sau khi có id mới load và connect
        this.loadTickets();
        this.connectWebSocket();
      } else {
        console.error('No showtimeId in URL');
      }
    });
    // this.checkLockTicketOnServer();
  }

  // Tách riêng method connectWebSocket() để subscribe sau khi client onConnect
  private connectWebSocket(): void {
    // Gọi activate() nếu chưa gọi
    this.stompService.client.activate();

    this.stompService.client.onConnect = () => {
      console.log('STOMP connected, now subscribing to topics');

      // 1. Chỉ subscribe một lần
      this.stompService.subscribe(
        `/topic/seat-status/${this.showtimeId}`,
        (message: Message) => {
          const payload = JSON.parse(message.body);
          const ticketId: string = payload.ticketId;
          const status: string = payload.status;   // "LOCKED" | "UNLOCKED" | "UNLOCK_TIMEOUT" | "BOOKED"
          const owner: string = payload.userId;   // user hành động

          // **Update UI ngay ở đây** (không gọi thêm subscribe)
          switch (status) {
            case 'LOCKED':
              if (owner === this.userId) {
                this.seatStatusMap[ticketId] = {status: 'LOCKED_BY_ME', lockedBy: owner};
              } else {
                this.seatStatusMap[ticketId] = {status: 'LOCKED', lockedBy: owner};
              }
              break;
            case 'UNLOCKED':
              this.seatStatusMap[ticketId] = {status: 'AVAILABLE'};
              break;
            case 'UNLOCK_TIMEOUT':
              if (owner === this.userId) {
                alert('Hết 7 phút giữ chỗ, bạn sẽ được chuyển về trang chủ');
                this.router.navigateByUrl('/');
                return;
              } else {
                this.seatStatusMap[ticketId] = {status: 'AVAILABLE'};
              }
              break;
            case 'BOOKED':
              this.seatStatusMap[ticketId] = {status: 'BOOKED'};
              break;
          }

          console.log('seatStatusMap after update:', this.seatStatusMap);
          // Khi seatStatusMap thay đổi, Angular tự detect và re-render UI cho tất cả user.
        }
      );

      // 2. Subscribe kênh user-specific errors (1 lần duy nhất)
      this.stompService.subscribeUserQueue((message: Message) => {
        const payload = JSON.parse(message.body);
        const ticketId: string = payload.ticketId;
        const owner: string = payload.owner;
        alert(`Ghế ${ticketId} đã bị người khác chọn (user ${owner}). Vui lòng chọn ghế khác.`);
        this.seatStatusMap[ticketId] = {status: 'AVAILABLE'};
      });
    };
  }


  private loadTickets(): void {
    this.ticketService.getTicketByShowTimeId(this.showtimeId).subscribe(
      (tickets: TicketApi.Response[] | null) => {
        if (!tickets) return;
        this.tickets = tickets;
        this.seatStatusMap = {};
        tickets.forEach(t => {
          if (t.ticketStatus === 'BOOKED') {
            this.seatStatusMap[t.id] = {status: 'BOOKED'};
          } else {
            this.seatStatusMap[t.id] = {status: 'AVAILABLE'};
          }
        });
      },
      err => console.error('Failed to load tickets', err)
    );
  }

  // private checkLockTicketOnServer(): void {
  //   // 1. Khi server broadcast lên /topic/seat-status/{showtimeId}, tất cả client gọi hàm callback này
  //   this.stompService.subscribe(
  //     `/topic/seat-status/${this.showtimeId}`,
  //     msg => {
  //       const payload = JSON.parse(msg.body);
  //       const ticketId: string = payload.ticketId;
  //       const status: string   = payload.status;   // "LOCKED" | "UNLOCKED" | "UNLOCK_TIMEOUT" | "BOOKED"
  //       const owner: string    = payload.userId;   // user đã lock/unlock/timeout/…
  //
  //       switch (status) {
  //         case 'LOCKED':
  //           if (owner === this.userId) {
  //             // Nếu chính bạn vừa lock ghế này
  //             this.seatStatusMap[ticketId] = { status: 'LOCKED_BY_ME', lockedBy: owner };
  //           } else {
  //             // Người khác vừa lock ghế này
  //             this.seatStatusMap[ticketId] = { status: 'LOCKED', lockedBy: owner };
  //           }
  //           break;
  //
  //         case 'UNLOCKED':
  //           // Ghế đã được unlock (trả về trống)
  //           this.seatStatusMap[ticketId] = { status: 'AVAILABLE' };
  //           break;
  //
  //         case 'UNLOCK_TIMEOUT':
  //           if (owner === this.userId) {
  //             // Nếu chính bạn bị timeout giữ ghế
  //             alert('Hết 7 phút giữ chỗ, bạn sẽ được chuyển về trang chủ');
  //             this.router.navigateByUrl('/');
  //             return; // Thoát luôn, không cần cập nhật thêm UI
  //           } else {
  //             // Người khác timeout, trả ghế về AVAILABLE
  //             this.seatStatusMap[ticketId] = { status: 'AVAILABLE' };
  //           }
  //           break;
  //
  //         case 'BOOKED':
  //           // Ghế đã được thanh toán thành công (chuyển sang trạng thái BOOKED)
  //           this.seatStatusMap[ticketId] = { status: 'BOOKED' };
  //           break;
  //       }
  //       console.log(this.seatStatusMap)
  //
  //       // Angular sẽ tự động detect khi seatStatusMap[ticketId] thay đổi,
  //       // DOM-bound bằng *ngClass hay điều kiện trong template sẽ cập nhật UI cho tất cả user.
  //     }
  //   );
  //
  //   // 2. Subcribe tới kênh user-specific để nhận error ALREADY_LOCKED (nếu có)
  //   this.stompService.subscribeUserQueue(msg => {
  //     const payload = JSON.parse(msg.body);
  //     const ticketId: string = payload.ticketId;
  //     const owner: string    = payload.owner;
  //
  //     alert(`Ghế ${ticketId} đã bị người khác chọn (user ${owner}). Vui lòng chọn ghế khác.`);
  //     // Có thể reload toàn bộ seatStatusMap hoặc chỉ set ticketId này về AVAILABLE:
  //     this.seatStatusMap[ticketId] = { status: 'AVAILABLE' };
  //   });
  // }


  onSeatClick(ticketId: string): void {
    const info = this.seatStatusMap[ticketId];
    if (!info) return;

    if (info.status === 'AVAILABLE') {
      // 1. Cập nhật UI: AVAILABLE → LOCKED_BY_ME
      this.seatStatusMap[ticketId] = {status: 'LOCKED_BY_ME', lockedBy: this.userId};
      this.mySelected.add(ticketId);
      console.log('Sau khi gán, seatStatusMap[ticketId]=', this.seatStatusMap[ticketId]);
      // 2. Gọi thẳng lock-seat
      this.ticketService.sendLockSeat({
        showTimeId: this.showtimeId,
        ticketId: ticketId,
        userId: this.userId
      });
    } else if (info.status === 'LOCKED_BY_ME') {
      // 1. Cập nhật UI: LOCKED_BY_ME → AVAILABLE
      this.seatStatusMap[ticketId] = {status: 'AVAILABLE'};
      this.mySelected.delete(ticketId);
      console.log('Sau khi gán, seatStatusMap[ticketId]=', this.seatStatusMap[ticketId]);

      // 2. Gửi unlock-seat
      this.ticketService.sendUnlockSeat({
        showTimeId: this.showtimeId,
        ticketId: ticketId,
        userId: this.userId
      });
    }
  }


  /** Lấy danh sách tickets trong hàng row, đã sort theo cột nhỏ→lớn */
  getTicketsByRow(row: string): TicketApi.Response[] {
    return this.tickets
      .filter(t => t.seat.seatRow === row)
      .sort((a, b) => a.seat.seatColumn - b.seat.seatColumn);
  }

  /** Nếu type=COUPLE và seatColumn chẵn, bỏ qua (vì ghép với ô trước) */
  shouldSkipCoupleSeat(row: string, seatNumber: number): boolean {
    const ticket = this.tickets.find(
      t => t.seat.seatRow === row && t.seat.seatColumn === seatNumber
    );
    return ticket?.seat.type === 'COUPLE' && seatNumber % 2 === 0;
  }

  /** Nếu type=COUPLE và seatColumn lẻ, đây là ô bắt đầu cặp đôi */
  isCoupleStartSeat(row: string, seatNumber: number): boolean {
    const ticket = this.tickets.find(
      t => t.seat.seatRow === row && t.seat.seatColumn === seatNumber
    );
    return ticket?.seat.type === 'COUPLE' && seatNumber % 2 === 1;
  }

  isSeatDisabled(ticketId: string): boolean {
    const info = this.seatStatusMap[ticketId];
    return info.status === 'LOCKED' || info.status === 'BOOKED';
  }

  getSeatClass(ticketId: string): string {
    const info = this.seatStatusMap[ticketId];
    if (!info) return '';
    switch (info.status) {
      case 'BOOKED':
        return 'booked';
      case 'LOCKED':
        return 'locked';
      case 'LOCKED_BY_ME':
        return 'selected';
      case 'AVAILABLE':
        return 'available';
      default:
        return '';
    }
  }
}
