import { Component, AfterViewInit } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import Swiper from 'swiper';
import { MovieCardComponent } from '../../../shared/ui/components/card-movie/movie-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { MOCK_MOVIES } from '../../../mock/mock-movies';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    MovieCardComponent,
    NgxPaginationModule,
    NgClass
  ]
})
export class HomeComponent implements AfterViewInit {
  slides = [
    { img: 'assets/images/slide1.jpg' },
    { img: 'assets/images/slide2.jpg' },
    { img: 'assets/images/slide3.jpg' },
    { img: 'assets/images/slide4.jpg' },
    { img: 'assets/images/slide5.jpg' },
    { img: 'assets/images/slide6.jpg' },
  ];

  activeTab: string = 'dangChieu';
  page = 1;
  allMovies = MOCK_MOVIES;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Initialize Swiper
    new Swiper('.mySwiper', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1.5,
      spaceBetween: 50,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay:2000,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

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
        movie.categories?.some((cat: string) =>
          cat.toLowerCase().includes('imax')
        )
      );
    }

    return this.allMovies;
  }

  goToDetail(movie: any) {
    this.router.navigate(['/movie', movie.id]);
  }
}
