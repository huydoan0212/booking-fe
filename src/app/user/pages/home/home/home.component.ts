import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { MovieCardComponent } from '../../../../shared/ui/components/card-movie/movie-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { MovieService } from '../../../../../service/movie/api/movie.service';
import { MovieApi } from '../../../../../service/movie/model/movie.model';

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
export class HomeComponent implements AfterViewInit, OnInit {
  // Slider images
  slides = [
    { img: 'assets/images/slide1.jpg' },
    { img: 'assets/images/slide2.jpg' },
    { img: 'assets/images/slide3.jpg' },
    { img: 'assets/images/slide4.jpg' },
    { img: 'assets/images/slide5.jpg' },
    { img: 'assets/images/slide6.jpg' },
  ];

  // Phim
  movies: MovieApi.Response[] = [];
  filteredMovies: MovieApi.Response[] = [];

  // Trạng thái lọc
  activeTab: 'dangChieu' | 'sapChieu' | 'all' = 'all';
  isFiltered: boolean = false;

  // Pagination
  page: number = 1;
  take: number = 8;
  hasNextPage: boolean = false;

  // Lọc mặc định
  filter: string = "name ~ '*'";
  sortBy: string = 'name';

  constructor(private router: Router) {}
  private readonly movieService = inject(MovieService);

  ngOnInit(): void {
    this.getMovies();
  }

  ngAfterViewInit(): void {
    new Swiper('.mySwiper', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1.5,
      spaceBetween: 50,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 2000,
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

  getMovies(): void {
    this.movieService.getMovies(this.filter, this.page, this.take, this.sortBy)
      .subscribe({
        next: (res: any) => {
          this.movies = res.responseData.rows;
          this.hasNextPage = res.responseData.hasNextPage;

          // Nếu không lọc thì hiển thị toàn bộ
          if (!this.isFiltered) {
            this.filteredMovies = [...this.movies];
          } else {

            this.filterMoviesByTab(this.activeTab);
          }
        },
        error: (err) => {
          console.error('Error loading movies', err);
        }
      });
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getMovies();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.page++;
      this.getMovies();
    }
  }

  goToDetail(movie: MovieApi.Response): void {
    this.router.navigate(['/movie', movie.id]);
  }

  filterMoviesByTab(tab: 'dangChieu' | 'sapChieu' | 'all'): void {
    this.activeTab = tab;
    this.isFiltered = tab !== 'all';

    if (tab === 'dangChieu') {
      const now = new Date();
      this.filteredMovies = this.movies.filter(movie => {
        if (!movie.startDate) return false;
        return new Date(movie.startDate) <= now;
      });
    } else if (tab === 'sapChieu') {
      const now = new Date();
      this.filteredMovies = this.movies.filter(movie => {
        if (!movie.startDate) return false;
        return new Date(movie.startDate) > now;
      });
    } else {
      // all
      this.filteredMovies = [...this.movies];
    }
  }


  showAllMovies(): void {
    this.activeTab = 'all';
    this.isFiltered = false;
    this.filteredMovies = [...this.movies];
  }
}
