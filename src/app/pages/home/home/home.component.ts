import {Component, AfterViewInit, OnInit, inject} from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import Swiper from 'swiper';
import { MovieCardComponent } from '../../../shared/ui/components/card-movie/movie-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';
import {Movie, MovieResponse} from '../../../../service/movie/model/movie.model';
import {MovieService} from '../../../../service/movie/api/movie.service';

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
export class HomeComponent implements AfterViewInit, OnInit{
  slides = [
    { img: 'assets/images/slide1.jpg' },
    { img: 'assets/images/slide2.jpg' },
    { img: 'assets/images/slide3.jpg' },
    { img: 'assets/images/slide4.jpg' },
    { img: 'assets/images/slide5.jpg' },
    { img: 'assets/images/slide6.jpg' },
  ];

  activeTab: string = 'dangChieu';
  filter: string = "name ~ '*'";
  page: number = 1;
  take: number = 8;
  sortBy: string = 'name';
  movies: Movie[] = [];
  hasNextPage: boolean = false;

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

  getMovies() {
    this.movieService.getMovies(this.filter, this.page, this.take, this.sortBy)
      .subscribe({
        next: (res: any) => {
          this.movies = res.responseData.rows;
          this.hasNextPage = res.responseData.hasNextPage;
        },
        error: (err) => {
          console.error('Error loading movies', err);
        }
      });
  }
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getMovies();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.page++;
      this.getMovies();
    }
  }
  goToDetail(movie: any) {
    this.router.navigate(['/movie', movie.id]);
  }
}
