import { Component } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import Swiper from 'swiper';
import {MovieCardComponent} from '../../../shared/ui/components/card-movie/movie-card.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {Router} from '@angular/router';
import {MOCK_MOVIES} from '../../../mock/mock-movies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    NgForOf,
    MovieCardComponent,
    NgxPaginationModule,
    NgClass
  ],
  standalone: true
})
export class HomeComponent {
  slides = [
    { img: 'assets/images/slide1.jpg' },
    { img: 'assets/images/slide2.jpg' },
    { img: 'assets/images/slide3.jpg' },
    { img: 'assets/images/slide4.jpg' },
    { img: 'assets/images/slide5.jpg' },
    { img: 'assets/images/slide6.jpg' },
  ];

  ngAfterViewInit() {
    new Swiper('.mySwiper', {
      slidesPerView: 1.5,          // Hiển thị 1.5 slide cùng lúc
      spaceBetween: 50,            // Khoảng cách giữa các slide
      loop: true,                  // Vòng lặp qua các slide
      centeredSlides: true,        // Căn giữa slide hiện tại
      autoplay: {
        delay: 3000                // Tự động chuyển slide sau mỗi 3 giây
      },
      pagination: {
        el: '.swiper-pagination',  // Chỉ định phần tử chứa pagination
        clickable: true            // Cho phép nhấp vào các điểm phân trang
      },
      navigation: {
        nextEl: '.swiper-button-next',  // Chỉ định nút next
        prevEl: '.swiper-button-prev',  // Chỉ định nút prev
      },
      effect: 'fade',              // Hiệu ứng chuyển đổi mờ dần
      speed: 800                   // Thời gian chuyển đổi (800ms)
    });
  }
  constructor(private router: Router) {}
  activeTab: string = 'dangChieu';
  page = 1;
  allMovies = MOCK_MOVIES;
  get movies() {
    const today = new Date();

    if (this.activeTab === 'dangChieu') {
      return this.allMovies.filter((movie) => {
        const start = new Date(movie.startDate);
        const end = new Date(movie.endDate);
        return start <= today && end >= today;
      });
    }

    if (this.activeTab === 'sapChieu') {
      return this.allMovies.filter((movie) => {
        const start = new Date(movie.startDate);
        return start > today;
      });
    }

    if (this.activeTab === 'imax') {
      return this.allMovies.filter((movie) =>
        movie.categories?.some((cat: string) => cat.toLowerCase().includes('imax'))
      );
    }

    return this.allMovies;
  }
  goToDetail(movie: any) {
    this.router.navigate(['/movie', movie.id]);
  }

}
