import {Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ShowTimeApi} from '../../../../../service/showtime/model/showtime.model';
import {ShowtimeService} from '../../../../../service/showtime/api/showtime.service';

@Component({
  selector: 'app-ticket-summary',
  templateUrl: './ticket-summary.component.html',
  styleUrls: ['./ticket-summary.component.scss'],
  imports: [CommonModule, NgOptimizedImage],
  standalone: true
})
export class TicketSummaryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() totalSeconds: number = 0;
  @Input() totalAmount: number = 0;
  @Input() showTimeId: string | null = null;
  @Input() numStandard: number = 0;
  @Input() numCouple: number = 0;
  @Input() labelsStandard: string[] | undefined;
  @Input() labelsCouple: string[] | undefined;
  @Input() labelsAll: string[] | undefined;
  @Input() totalAmountCouple: number = 0;
  @Input() totalAmountStandard: number = 0;
  private readonly showtimeService = inject(ShowtimeService);

  minutes: number = 0;
  seconds: number = 0;
  showTime: ShowTimeApi.Response | null | undefined;
  private intervalId: any;

  ngOnInit(): void {
    if (this.totalSeconds > 0) {
      this.startCountdown();
    }
    // 2. Lấy detail showTime từ API
    if (this.showTimeId) {
      this.showtimeService.getShowTimeById(this.showTimeId)
        .subscribe({
          next: res => {
            // Giả sử API trả về { data: ShowTimeApi.Response }
            this.showTime = res.responseData;
          },
          error: err => console.error('Failed to load showTime detail', err)
        });
    } else {
      console.error('showTimeId is null or undefined');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalSeconds'] && !changes['totalSeconds'].isFirstChange()) {
      this.resetCountdown();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private startCountdown(): void {
    this.updateDisplayTime();
    this.intervalId = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        this.updateDisplayTime();
      } else {
        clearInterval(this.intervalId);
        this.onCountdownFinished();
      }
    }, 1000);
  }

  private resetCountdown(): void {
    clearInterval(this.intervalId);
    this.startCountdown();
  }

  private updateDisplayTime(): void {
    this.minutes = Math.floor(this.totalSeconds / 60);
    this.seconds = this.totalSeconds % 60;
  }

  onCountdownFinished(): void {
    alert('Hết thời gian giữ ghế. Vui lòng chọn lại.');
    // Có thể emit sự kiện lên parent hoặc điều hướng
  }
}
