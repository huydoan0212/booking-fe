import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ShowtimeService} from '../../../../service/showtime/api/showtime.service';
import {ShowTimeApi} from '../../../../service/showtime/model/showtime.model';

@Component({
  selector: 'app-show-times',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './showtimes.component.html',
  styleUrls: ['./showtimes.component.css']
})
export class ShowtimesComponent implements OnInit {
  @ViewChild('dayList') dayList!: ElementRef;

  private showTimeList: ShowTimeApi.Response[] = [];

  public days: { weekday: string; date: string; isSelected: boolean }[] = [];
  public showtimes: string[] = ['09:30', '11:30', '12:30', '14:00', '15:00'];
  private readonly showtimeService = inject(ShowtimeService);
  ngOnInit(): void {
    this.generateDays();
    this.searchShowTime('3e4e6db0-70e0-4616-bd2f-4c20d8590400',1, 1);
  }

  generateDays(): void {
    const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const today = new Date();

    this.days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const isToday = i === 0;
      const weekday = isToday ? 'Hôm Nay' : weekdays[date.getDay()];
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');

      return {
        weekday,
        date: `${day}/${month}`,
        isSelected: isToday
      };
    });
  }
  searchShowTime(movieId: string, page: number, take: number){
    this.showtimeService.searchShowTime(movieId, page, take).subscribe({
        next: result => {
          this.showTimeList = result.responseData.rows
          console.log(this.showTimeList);
        },
      error: error => {
          console.log(error);
      }
      }
    )
  }



  scrollLeft(): void {
    if (this.dayList?.nativeElement) {
      this.dayList.nativeElement.scrollBy({ left: -96, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.dayList?.nativeElement) {
      this.dayList.nativeElement.scrollBy({ left: 120, behavior: 'smooth' });
    }
  }

  selectDay(selectedDay: any): void {
    this.days.forEach(day => day.isSelected = false);
    selectedDay.isSelected = true;
  }

  selectTime(time: string): void {
    console.log('Selected showtime:', time);
  }
}

