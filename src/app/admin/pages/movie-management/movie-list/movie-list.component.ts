import { Component, inject, OnInit } from '@angular/core';
import { MovieService } from '../../../../../service/movie/api/movie.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MovieApi } from '../../../../../service/movie/model/movie.model';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CinemaApi } from '../../../../../service/cinema/model/cinema.model';
import { CinemaService } from '../../../../../service/cinema/api/cinema.service';
import { CinemaHallService } from '../../../../../service/cinemaHall/api/cinemalHall.service';
import { CinemaHallApi } from '../../../../../service/cinemaHall/model/cinemalHall.model';
import {CategoryService} from '../../../../../service/category/api/category.service';
import {CategoryApi} from '../../../../../service/category/model/category.model';
import {UploadService} from '../../../../../service/upload/upload.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  imports: [FormsModule, NgForOf, NgIf, DatePipe, DecimalPipe],
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly cinemaService = inject(CinemaService);
  private readonly cinemaHallService = inject(CinemaHallService);
  private readonly categoryService = inject(CategoryService);
  private readonly uploadService = inject(UploadService);
  movies: MovieApi.Response[] = [];
  categories: CategoryApi.Response[] = [];
  cinemas: CinemaApi.Response[] = [];
  cinemaHalls: CinemaHallApi.Response[] = [];

  searchInputChanged = new Subject<string>();
  name: string = '';
  page: number = 1;
  take: number = 10;
  pageCount: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;

  modalVisible = false;
  selectedMovieId: string = '';
  selectedMovieName: string = '';

  showModalAddMovie = false;
  showModalEditMovie = false;
  showModalShowtime = false;

  selectedCinemaId = '';

  ngOnInit(): void {
    this.getMovies();
    this.searchCinemaHallByCinemaId();
    this.getCategories();
    this.movieService.createMovie(this.movieForm).subscribe({
      next: (res) => {
        console.log('Thêm phim thành công:', res);
        this.showModalAddMovie = false;
        this.getMovies();
      },
      error: (err) => {
        console.error('Lỗi khi thêm phim:', err);
      }
    });
    this.searchInputChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.name = value;
        this.page = 1;
        this.getMovies();
      });
  }
  // movieForm: MovieApi.Request = {
  //   name: '',
  //   age: 0,
  //   duration: 0,
  //   imageLandscape: '',
  //   imagePortrait: '',
  //   slug: '',
  //   rate: 0,
  //   totalVotes: 0,
  //   views: 0,
  //   description: '',
  //   sortOrder: 0,
  //   actors: '',
  //   director: '',
  //   producers: 'A',
  //   country: '',
  //   trailer: '',
  //   status: 1,
  //   startDate: '',
  //   endDate: '',
  //   categoryIds: []
  // };

  movieForm: MovieApi.Request = {
    name: 'Inception',
    age: 16,
    duration: 148,
    imageLandscape: 'https://example.com/inception-landscape.jpg',
    imagePortrait: 'https://example.com/inception-portrait.jpg',
    slug: 'inception',
    rate: 8.8,
    totalVotes: 2000000,
    views: 10000000,
    description: 'A mind-bending thriller by Christopher Nolan.',
    sortOrder: 1,
    actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
    director: 'Christopher Nolan',
    producers: 'Emma Thomas, Christopher Nolan',
    country: 'USA',
    trailer: 'https://example.com/inception-trailer.mp4',
    status: 1,
    startDate: '2025-06-15T00:00:00Z',
    endDate: '2025-12-31T00:00:00Z',
    categoryIds: ['550e8400-e29b-41d4-a716-446655440000']
  };


  onImageSelect(event: any, type: 'landscape' | 'portrait') {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (res) => {
          const url = res.responseData?.url;
          if (type === 'landscape') {
            this.movieForm.imageLandscape = url;
          } else {
            this.movieForm.imagePortrait = url;
          }
        }
      });
    }
  }



  submitMovie() {
    this.movieForm.slug = this.movieForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    console.log(this.movieForm);
    if (!this.movieForm.name || !this.movieForm.imageLandscape || !this.movieForm.imagePortrait) {
      console.warn('Vui lòng điền đầy đủ thông tin');
      return;
    }

    this.movieService.createMovie(this.movieForm).subscribe({
      next: (res) => {
        console.log('Thêm phim thành công:', res);
        this.showModalAddMovie = false;
        this.getMovies();
      },
      error: (err) => {
        console.error('Lỗi khi thêm phim:', err);
      }
    });
  }





  editMovieForm: any = {};

  form = {

  };



  onCinemaChange() {

  }

  submitShowtime() {
    this.showModalShowtime = false;
  }

  getCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data ?? [];
      },
      error: (error) => {
        console.error('Lỗi khi lấy thể loại:', error);
      }
    });
  }

  getMovies() {
    this.movieService.searchMovies(this.name, this.page, this.take, 'ASC').subscribe({
      next: (res) => {
        const data = res.responseData;
        this.movies = data.rows ?? [];
        this.page = data.page;
        this.take = data.take;
        this.pageCount = data.pageCount;
        this.hasPreviousPage = data.hasPreviousPage;
        this.hasNextPage = data.hasNextPage;
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách phim:', error);
      }
    });
  }

  getCinemas() {
    this.cinemaService.getAllCinema().subscribe({
      next: (data) => {
        this.cinemas = data ?? [];
      },
      error: (error) => {
        console.error('Lỗi khi lấy thể loại:', error);
      }
    });
  }

  searchCinemaHallByCinemaId() {
    this.cinemaHallService.searchCinemaHallByCinemaId('fb233b0f-edb4-4eb1-ade8-7f8b83ab2457', 1, 10, 'ASC').subscribe({
      next: (res) => {
        const data = res.responseData;
        this.cinemaHalls = data.rows ?? [];
        this.page = data.page;
        this.take = data.take;
        this.pageCount = data.pageCount;
        this.hasPreviousPage = data.hasPreviousPage;
        this.hasNextPage = data.hasNextPage;
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách phim:', error);
      }
    });
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.page++;
      this.getMovies();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage && this.page > 1) {
      this.page--;
      this.getMovies();
    }
  }

  exportExcel(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachPhim');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'danhsachphim.xlsx');
  }

  exportCSV(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const file = new Blob([csv], { type: 'text/csv' });
    saveAs(file, 'danhsachphim.csv');
  }

  openDeleteModal(id: string, name: string): void {
    this.selectedMovieId = id;
    this.selectedMovieName = name;
    this.modalVisible = true;
  }

  confirmDeleteMovie(): void {
    this.movieService.deleteMovie(this.selectedMovieId).subscribe({
      next: () => {
        this.modalVisible = false;
        this.getMovies();
      },
      error: (err) => {
        console.error('Lỗi khi xoá:', err);
        this.modalVisible = false;
      }
    });
  }

  openEditMovieModal(movie: any) {
    this.editMovieForm = { ...movie };
    this.showModalEditMovie = true;
  }
}
