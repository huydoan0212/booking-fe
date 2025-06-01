import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-ticket-summary',
  templateUrl: './ticket-summary.component.html',
  styleUrls: ['./ticket-summary.component.scss'],
  imports: [CommonModule],
})
export class TicketSummaryComponent implements OnInit, OnDestroy {
  totalSeconds = 6 * 60;
  minutes: number = 0;
  seconds: number = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startCountdown(): void {
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

  updateDisplayTime(): void {
    this.minutes = Math.floor(this.totalSeconds / 60);
    this.seconds = this.totalSeconds % 60;
  }

  onCountdownFinished(): void {
    alert('Hết thời gian giữ ghế. Vui lòng chọn lại.');
    // Hoặc điều hướng lại trang chọn ghế
  }
}
