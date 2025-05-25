import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-times',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './showtimes.component.html',
  styleUrls: ['./showtimes.component.css']
})
export class ShowtimesComponent {
  @ViewChild('dayList') dayList!: ElementRef;

  days = [
    { weekday: 'Hôm Nay', date: '20/04', isSelected: true },
    { weekday: 'Thứ Ba', date: '21/04', isSelected: false },
    { weekday: 'Thứ Tư', date: '22/04', isSelected: false },
    { weekday: 'Thứ Năm', date: '23/04', isSelected: false },
    { weekday: 'Thứ Sáu', date: '24/04', isSelected: false },
    { weekday: 'Thứ Bảy', date: '25/04', isSelected: false },
    { weekday: 'Chủ Nhật', date: '26/04', isSelected: false },
  ];

  scrollLeft() {
    this.dayList.nativeElement.scrollBy({ left: -96, behavior: 'smooth' });
  }

  scrollRight() {
    this.dayList.nativeElement.scrollBy({ left: 120, behavior: 'smooth' });
  }

  selectDay(selectedDay: any) {
    this.days.forEach(day => day.isSelected = false);
    selectedDay.isSelected = true;
  }
  showtimes: string[] = ['09:30', '11:30', '12:30', '14:00', '15:00'];
  selectTime(time: string) {
    console.log('Selected showtime:', time);
    // Bạn có thể điều hướng hoặc xử lý logic tiếp theo ở đây
  }
}
