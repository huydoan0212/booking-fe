import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./payment-result.component.scss']
})
export class PaymentResultComponent implements OnInit {
  paymentStatus: 'success' | 'fail' = 'fail';
  countdown: number = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paymentStatus = params['payment'] === 'success' ? 'success' : 'fail';
      // Bắt đầu đếm ngược
      this.startCountdown();
    });
  }

  startCountdown() {
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(timer);
        this.router.navigate(['/']);
      }
    }, 1000);
  }
}
