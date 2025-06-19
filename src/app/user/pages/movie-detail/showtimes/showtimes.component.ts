import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ShowtimeService} from '../../../../../service/showtime/api/showtime.service';
import {ShowTimeApi} from '../../../../../service/showtime/model/showtime.model';
import {ResponseResult, Rows} from '../../../../shared/data-access/interface/response.type';
import {routes} from '../../../../app.routes';
import {Router} from '@angular/router';

interface ShowtimeDisplay {
  id: string;
  time: string;
  language: string;
  subtitle: string;
  screenFormat: string;
  cinemaName: string;
}

interface DayWithShowtimes {
  date: Date;
  weekday: string;
  isSelected: boolean;
  showtimes: ShowtimeDisplay[];
}

@Component({
  selector: 'app-show-times',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './showtimes.component.html',
  styleUrls: ['./showtimes.component.css']
})
export class ShowtimesComponent implements OnInit {
  constructor(private routes: Router) {
  }
  @ViewChild('dayList', { static: true }) dayList!: ElementRef;

  public days: DayWithShowtimes[] = [];
  public selectedDay!: DayWithShowtimes;

  /** Danh sách rạp thực sự có showtime */
  public cinemas: string[] = ['Tất cả rạp','Galaxy Nguyễn Du','Galaxy Sala','Galaxy Tân Bình','Galaxy Kinh Dương Vương',
    'Galaxy Quang Trung','Galaxy Bến Tre','Galaxy Mipec Long Biên','Galaxy Đà Nẵng',
    'Galaxy Cà Mau','Galaxy Trung Chánh','Galaxy Huỳnh Tấn Phát','Galaxy Vinh',
    'Galaxy Hải Phòng','Galaxy Nguyễn Văn Quá','Galaxy Buôn Ma Thuột',
    'Galaxy Long Xuyên','Galaxy Co.opXtra Linh Trung','Galaxy Nha Trang Center',
    'Galaxy Trường Chinh','Galaxy GO! Mall Bà Rịa','Galaxy Aeon Mall Huế',
    'Galaxy Parc Mall Q8'];
  /** 'Tất cả rạp' hoặc tên rạp cụ thể */
  public selectedCinema = 'Tất cả rạp';

  private rawShowTimes: ShowTimeApi.Response[] = [];
  private readonly showtimeService = inject(ShowtimeService);

  private readonly movieId = '3e4e6db0-70e0-4616-bd2f-4c20d8590400';
  private readonly page = 1;
  private readonly take = 200;

  ngOnInit(): void {
    this.initDays();
    this.selectedDay = this.days[0];
    this.loadShowTimes();
  }

  private initDays(): void {
    const weekdays = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
    const today = new Date();
    this.days = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        date: d,
        weekday: i === 0 ? 'Hôm Nay' : weekdays[d.getDay()],
        isSelected: i === 0,
        showtimes: []
      };
    });
  }

  private loadShowTimes(): void {
    this.showtimeService
      .searchShowTime(
        this.movieId,
        this.page,
        this.take,
        '', // bỏ location filter
        ''  // bỏ cinemaName filter
      )
      .subscribe({
        next: (res: ResponseResult<Rows<ShowTimeApi.Response>>) => {
          this.rawShowTimes = res.responseData?.rows ?? [];
          this.mapShowTimesToDays();
          // this.buildCinemaList();
          this.selectedCinema = 'Tất cả rạp';
        },
        error: err => console.error('Fetch showtimes error', err)
      });
  }

  private mapShowTimesToDays(): void {
    this.days.forEach(d => d.showtimes = []);
    this.rawShowTimes.forEach(st => {
      const dt = new Date(st.showTime);
      const bucket = this.days.find(day =>
        day.date.getFullYear() === dt.getFullYear() &&
        day.date.getMonth()    === dt.getMonth() &&
        day.date.getDate()     === dt.getDate()
      );
      if (!bucket) return;
      const hh = String(dt.getHours()).padStart(2,'0');
      const mm = String(dt.getMinutes()).padStart(2,'0');
      bucket.showtimes.push({
        id: st.id,
        time: `${hh}:${mm}`,
        language: st.language,
        subtitle: st.subtitle,
        screenFormat: st.screenFormat,
        cinemaName: st.cinemaHall.cinema.name   // từ response
      });
    });
    this.days.forEach(d =>
      d.showtimes.sort((a,b) => a.time.localeCompare(b.time))
    );
  }

  /** Tập hợp unique cinemaName từ tất cả showtimes */
  // private buildCinemaList(): void {
  //   const set = new Set<string>();
  //   this.rawShowTimes.forEach(st =>
  //     set.add(st.cinemaHall.cinema.name)
  //   );
  //   this.cinemas = ['Tất cả rạp', ...Array.from(set)];
  // }

  scrollLeft(): void {
    this.dayList.nativeElement.scrollBy({ left: -96, behavior: 'smooth' });
  }
  scrollRight(): void {
    this.dayList.nativeElement.scrollBy({ left: 120, behavior: 'smooth' });
  }

  selectDay(day: DayWithShowtimes): void {
    this.days.forEach(d => d.isSelected = false);
    day.isSelected = true;
    this.selectedDay = day;
  }

  selectTime(show: ShowtimeDisplay): void {
    console.log('Chọn suất:', show);
    console.log('Rạp:', this.selectedCinema);
  }

  onCinemaChange(cinema: string): void {
    this.selectedCinema = cinema;
    // không gọi lại API, chỉ thay đổi hiển thị ở template
  }

  /** Lọc showtimes cho 1 rạp cụ thể hay tất cả */
  getShowtimesForCinema(cinemaName: string): ShowtimeDisplay[] {
    return this.selectedDay.showtimes
      .filter(s => cinemaName === 'Tất cả rạp'
        ? true
        : s.cinemaName === cinemaName
      );
  }
  /** Thay thế selectTime bằng goToBooking */
  goToBooking(showId: string): void {
    this.routes.navigate(['/seat-booking', showId]);
  }
}
