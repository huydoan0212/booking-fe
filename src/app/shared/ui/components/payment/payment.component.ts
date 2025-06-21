import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {ResponseResult} from '../../../data-access/interface/response.type';
import {BookingApi} from '../../../../../service/booking/model/booking.model';
import {BookingService} from '../../../../../service/booking/api/booking.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  @Input() visible = false;
  @Input() userId!: string | null;
  @Input() showTimeId!: string;
  @Input() ticketIds: string[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() booked = new EventEmitter<BookingApi.Response>();

  loading = false;
  errorMessage: string | null = null;
  /** Mã khuyến mãi người dùng nhập vào */
  discountId: string = '';

  constructor(private bookingService: BookingService) {
  }

  onCloseClick() {
    this.close.emit();
  }

  onConfirmClick() {
    console.log(this.userId)
    if (!this.userId || this.ticketIds.length === 0) {
      this.errorMessage = 'Thiếu thông tin đặt vé.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Build request, omit discountId if empty
    const request: BookingApi.Request = {
      userId: this.userId,
      ticketIds: this.ticketIds,
      ...(this.discountId.trim() && {discountId: this.discountId.trim()})
    } as BookingApi.Request;

    // 1. Tạo booking
    this.bookingService.createBooking(request).subscribe({
      next: res => {
        if (res.success && res.responseData) {
          const bookingId = res.responseData.id;
          // 2. Gọi API payment
          this.bookingService.payment(bookingId).subscribe({
            next: payRes => {
              this.loading = false;
              if (payRes.success && payRes.responseData) {
                const url = payRes.responseData.url;
                // 3. Điều hướng tới URL thanh toán
                console.log(url)
                window.location.replace(url);
                // window.open(url, '_blank');
              } else {
                this.errorMessage = 'Thanh toán thất bại.';
              }
            },
            error: payErr => {
              this.loading = false;
              this.errorMessage = payErr.error?.message || 'Lỗi khi gọi thanh toán.';
            }
          });
        } else {
          this.loading = false;
          this.errorMessage = 'Đặt vé thất bại.';
        }
      },
      error: err => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Bạn chưa đăng nhập hoặc hết phiên làm việc.';
        } else {
          this.errorMessage = err.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
        }
      }
    });
  }
}
