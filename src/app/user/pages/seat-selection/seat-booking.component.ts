import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Message} from '@stomp/stompjs';
import {Observable, Subscription, timer} from 'rxjs';
import {TicketSummaryComponent} from '../../../shared/ui/components/ticket-summary/ticket-summary.component';
import {PaymentComponent} from '../../../shared/ui/components/payment/payment.component';
import {TicketService} from '../../../../service/ticket/api/ticket.service';
import {StompService} from '../../../service/stomp.service';
import {AllHoldInfo, HeldTicket, TicketApi} from '../../../../service/ticket/model/ticket.model';
import {AuthService} from '../../../../service/auth/auth.service';
import {UserService} from '../../../../service/user/api/user.service';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  standalone: true,
  styleUrls: ['./seat-booking.component.scss'],
  imports: [CommonModule, TicketSummaryComponent, PaymentComponent]
})
export class SeatBookingComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService: AuthService = inject(AuthService);
  private readonly userService: UserService = inject(UserService);
  holdSubscription?: Subscription;
  holdExpiresIn = 0;         // seconds remaining
  displayTimer = '07:00';
  userId: string = '1';
  showTimeId!: string;
  totalAmount = 0; // Tổng số tiền ghế đã chọn
  private readonly HOLD_DURATION_SECONDS = 420;
  tickets: TicketApi.Response[] = [];
  heldTickets: HeldTicket[] = [];
  otherHeldTickets: HeldTicket[] = [];
  // Map ticketId → trạng thái: "BOOKED" | "AVAILABLE" | "LOCKED" | "LOCKED_BY_ME"
  seatStatusMap: Record<string, { status: string; lockedBy?: string | null }> = {};
  numStandard: number = 0;
  numCouple: number = 0;
  labelsAll: string[] | undefined;
  labelsStandard: string[] | undefined;
  labelsCouple: string[] | undefined;
  totalAmountCouple: number = 0;
  totalAmountStandard: number = 0;
  mySelected: Set<string> = new Set<string>();
  rows: string[] = ['L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  showPaymentModal = false;
  /** Mảng cập nhật realtime chứa id các ghế user đang chọn */
  selectedSeatIds: string[] = [];

  private updateSelectedSeats() {
    this.selectedSeatIds = Array.from(this.mySelected);
  }

  constructor(
    private ticketService: TicketService,
    private stompService: StompService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    const username = this.authService.getUsername()
    // this.userService.getUserByUsername(username, 1, 1, 'username')
    //   .subscribe({
    //     next: res => {
    //       const users = res.responseData;
    //       if (users && users.length > 0) {
    //         this.userId = users[0].id;
    //         console.log('Fetched userId =', this.userId);
    //         // 2. Sau khi đã có userId, mới gọi releaseAllHolds
    //       } else {
    //         console.warn('Không tìm thấy user với username', username);
    //       }
    //     },
    //     error: err => {
    //       console.error('Lỗi khi lấy user:', err);
    //     }
    //   });
    this.userId = this.authService.userData.id;
    console.log(this.userId)
// 1. Lấy showTimeId từ URL trước
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.showTimeId = id;
        // 2. Sau khi có id mới load và connect
      } else {
        console.error('No showTimeId in URL');
      }
    });
    this.loadTicketsAndHold();
    this.connectWebSocket();
    // this.checkLockTicketOnServer();
  }

  handleOpenPayment() {
    // Lọc ra những seatId mà status là 'LOCKED_BY_ME'
    const myLockedSeats = Object.entries(this.seatStatusMap)
      .filter(([seatId, info]) => info.status === 'LOCKED_BY_ME')
      .map(([seatId]) => seatId);

    if (myLockedSeats.length === 0) {
      // Nếu không có ghế nào do mình giữ, cảnh báo và return
      alert('Vui lòng chọn ít nhất 1 ghế trước khi thanh toán.');
      return;
    }

    // Nếu có ghế, mở popup thanh toán
    this.showPaymentModal = true;
  }


  /** User bấm đóng trên Payment */
  handleClosePayment() {
    this.showPaymentModal = false;
  }

  /** User xác nhận thanh toán */
  handleConfirmPayment() {
    // TODO: gọi API thanh toán, redirect VNPAY...
    this.showPaymentModal = false;
  }

  // Tách riêng method connectWebSocket() để subscribe sau khi client onConnect
  private connectWebSocket(): void {
    // Gọi activate() nếu chưa gọi
    this.stompService.client.activate();

    this.stompService.client.onConnect = () => {
      console.log('STOMP connected, now subscribing to topics');

      // 1. Chỉ subscribe một lần
      this.stompService.subscribe(
        `/topic/seat-status/${this.showTimeId}`,
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

  private loadTicketsAndHold(): void {
    this.ticketService.getTicketByShowTimeId(this.showTimeId).subscribe(
      (tickets: TicketApi.Response[] | null) => {
        if (!tickets) return;
        this.tickets = tickets;

        // Khởi tạo seatStatusMap: BOOKED hoặc AVAILABLE
        this.seatStatusMap = {};
        tickets.forEach(t => {
          if (t.ticketStatus === 'BOOKED') {
            this.seatStatusMap[t.id] = {status: 'BOOKED'};
          } else {
            this.seatStatusMap[t.id] = {status: 'AVAILABLE'};
          }
        });

        // ✅ Sau khi load ghế, mới load trạng thái giữ vé
        this.loadUserHold();
      },
      (err: any) => console.error('Failed to load tickets', err)
    );
  }

  onSeatClick(ticketId: string): void {
    const info = this.seatStatusMap[ticketId];
    if (!info) return;

    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const {price, ticketType} = ticket;
    const row = ticket.seat.seatRow;
    const col = ticket.seat.seatColumn;
    const label = `${row}${col}`;

    // đảm bảo labelsAll đã được khởi tạo
    if (!this.labelsAll) this.labelsAll = [];

    const getAdjacentTicketId = (offset: number) => {
      return this.tickets.find(
        t => t.seat.seatRow === row && t.seat.seatColumn === col + offset
      )?.id;
    };

    if (info.status === 'AVAILABLE') {
      const toLock: Array<{ ticketId: string; price: number; seatLabel: string; seatType: string }> = [];

      if (ticketType === 'COUPLE') {
        const partnerId = getAdjacentTicketId(1);
        if (!partnerId || this.seatStatusMap[partnerId]?.status !== 'AVAILABLE') {
          alert('Ghế đôi kề bên không hợp lệ!');
          return;
        }
        const partnerLabel = `${row}${col + 1}`;
        toLock.push(
          {ticketId, price, seatLabel: label, seatType: ticketType},
          {ticketId: partnerId, price, seatLabel: partnerLabel, seatType: ticketType}
        );

        // thêm 2 label
        this.labelsAll.push(label, partnerLabel);
        this.numCouple += 2;
        this.totalAmountCouple += price * 2;
        this.updateSelectedSeats();
      } else {
        toLock.push({ticketId, price, seatLabel: label, seatType: ticketType});

        // thêm 1 label
        this.labelsAll.push(label);
        this.numStandard += 1;
        this.totalAmountStandard += price;
        this.updateSelectedSeats();
      }

      // gọi API lock
      toLock.forEach(item =>
        this.ticketService.sendLockSeat({
          showTimeId: this.showTimeId,
          ticketId: item.ticketId,
          userId: this.userId,
          price: item.price,
          seatLabel: item.seatLabel,
          seatType: item.seatType
        }).subscribe(() => {
          this.seatStatusMap[item.ticketId] = {status: 'LOCKED_BY_ME', lockedBy: this.userId};
          this.mySelected.add(item.ticketId);
          this.totalAmount += item.price;
          this.updateSelectedSeats();
        })
      );

      if (!this.holdSubscription) {
        this.startHoldTimer(this.HOLD_DURATION_SECONDS);
      }

    } else if (info.status === 'LOCKED_BY_ME') {
      // unlock
      const toUnlock: string[] = [];

      if (ticketType === 'COUPLE') {
        const partnerId = getAdjacentTicketId(1);
        const partnerLabel = `${row}${col + 1}`;
        toUnlock.push(ticketId);
        if (partnerId) toUnlock.push(partnerId);

        // xóa cả 2 label
        this.labelsAll = this.labelsAll.filter(l => l !== label && l !== partnerLabel);
        this.numCouple -= 2;
        this.totalAmountCouple -= price * 2;

      } else {
        toUnlock.push(ticketId);

        // xóa 1 label
        this.labelsAll = this.labelsAll.filter(l => l !== label);
        this.numStandard -= 1;
        this.totalAmountStandard -= price;
      }

      toUnlock.forEach(id =>
        this.ticketService.sendUnlockSeat({showTimeId: this.showTimeId, ticketId: id, userId: this.userId})
          .subscribe(() => {
            this.seatStatusMap[id] = {status: 'AVAILABLE'};
            this.mySelected.delete(id);
            this.updateSelectedSeats();
            const t = this.tickets.find(t => t.id === id);
            if (t) this.totalAmount -= t.price;
          })
      );
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

  private loadUserHold(): void {
    this.ticketService.getUserHold(this.showTimeId, this.userId)
      .subscribe((res: AllHoldInfo.Response) => {
        // reset
        this.heldTickets = res.heldTickets;
        this.mySelected.clear();
        this.updateSelectedSeats();
        this.otherHeldTickets = res.otherHeldTickets;
        // reset tổng tiền
        this.totalAmount = 0;
        this.totalAmountStandard = 0;
        this.totalAmountCouple = 0;

        // build seatStatusMap và mySelected
        this.heldTickets.forEach(ht => {
          this.seatStatusMap[ht.ticketId] = {status: 'LOCKED_BY_ME', lockedBy: this.userId};
          this.mySelected.add(ht.ticketId);
          this.updateSelectedSeats();
        });
        // 3) Đánh dấu vé của người khác
        res.otherHeldTickets.forEach(ht => {
          this.seatStatusMap[ht.ticketId] = {status: 'LOCKED', lockedBy: 'OTHER'};
        });

        this.updateSelectedSeats();

        // tính tổng tiền chung
        this.totalAmount = this.heldTickets
          .reduce((sum, ht) => sum + ht.price, 0);

        // tính tổng tiền ghế đơn (bao gồm VIP nếu muốn)
        this.totalAmountStandard = this.heldTickets
          .filter(ht => ht.seatType === 'STANDARD' || ht.seatType === 'VIP')
          .reduce((sum, ht) => sum + ht.price, 0);

        // tính tổng tiền ghế đôi
        this.totalAmountCouple = this.heldTickets
          .filter(ht => ht.seatType === 'COUPLE')
          .reduce((sum, ht) => sum + ht.price, 0);

        // đếm số lượng
        this.numStandard = this.heldTickets.filter(ht => ht.seatType === 'STANDARD' || ht.seatType === 'VIP').length;
        this.numCouple = this.heldTickets.filter(ht => ht.seatType === 'COUPLE').length;

        // labels
        this.labelsAll = this.heldTickets.map(ht => ht.seatLabel);
        this.labelsStandard = this.heldTickets.filter(ht => ht.seatType === 'STANDARD' || ht.seatType === 'VIP').map(ht => ht.seatLabel);
        this.labelsCouple = this.heldTickets.filter(ht => ht.seatType === 'COUPLE').map(ht => ht.seatLabel);

        this.holdExpiresIn = res.secondsRemaining;
        if (res.secondsRemaining > 0) {
          this.startHoldTimer(res.secondsRemaining);
        }
      });
  }


  private startHoldTimer(seconds: number) {
    this.holdExpiresIn = seconds;
    if (this.holdSubscription) this.holdSubscription.unsubscribe();

    this.holdSubscription = timer(0, 1000).subscribe(elapsed => {
      const remaining = seconds - elapsed;
      if (remaining <= 0) {
        this.displayTimer = '00:00';
        this.holdSubscription?.unsubscribe();

        // 1) Gửi lệnh release all hold lên server
        this.stompService.send('/app/release-all-hold', {
          showTimeId: this.showTimeId,
          userId: this.userId
        });

        // 2) Tùy chọn: bạn có thể navigate hoặc reload, hoặc chỉ hiển thị alert
        alert('Hết thời gian giữ ghế. Bạn sẽ được chuyển về trang chủ.');
        this.router.navigateByUrl('/');
      } else {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        this.displayTimer = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    });
  }

  goToConfirmPage(movie: any) {
    this.router.navigate(['/movie', movie.id]);
  }
}
