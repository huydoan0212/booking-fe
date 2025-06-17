import {Component, inject, OnInit} from '@angular/core';
import {MovieService} from '../../../../../service/movie/api/movie.service';
import {debounceTime, distinctUntilChanged, Observable, Subject} from 'rxjs';
import {MovieApi} from '../../../../../service/movie/model/movie.model';
import {FormsModule} from '@angular/forms';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {CinemaApi} from '../../../../../service/cinema/model/cinema.model';
import {CinemaService} from '../../../../../service/cinema/api/cinema.service';
import {CinemaHallService} from '../../../../../service/cinemaHall/api/cinemalHall.service';
import {CinemaHallApi} from '../../../../../service/cinemaHall/model/cinemalHall.model';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    DatePipe,
    DecimalPipe
  ],
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly cinemaService = inject(CinemaService);
  private readonly cinemaHallService = inject(CinemaHallService);
  searchInputChanged = new Subject<string>();
  movies: MovieApi.Response[] = [];
  name: string = "";
  page: number = 1;
  take: number = 10;
  pageCount: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;
  cinemas: CinemaApi.Response[] = [];
  cinemaHalls: CinemaHallApi.Response[] = [];
  ngOnInit(): void {
    this.getMovies();
    this.searchCinemaHallByCinemaId();
    this.searchInputChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.name = value;
        this.page = 1;
        this.getMovies();
      });
  }

  getCinemas(): void {
    this.cinemaService.getAllCinema().subscribe({
      next: (data) => {
        this.cinemas = data ?? [];
      },
      error: (error) => {
        console.error('Lỗi khi lấy thể loại:', error);
      }
    });
  }

  showModalShowtime = false;

  selectedCinemaId = '';
  form = {
    movieId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    cinemaHallId: '',
    showTime: '',
    language: '',
    subtitle: '',
    screenFormat: ''
  };

  onCinemaChange() {
    this.form.cinemaHallId = '';
  }

  submitShowtime() {
    this.showModalShowtime = false;
  }


  movieForm = {
    name: '',
    age: 0,
    duration: 0,
    imageLandscape: '',
    imagePortrait: '',
    startDate: '',
    endDate: '',
    categoryIds: [],
    description: '',
    director: '',
    actors: '',
    trailer: '',
    status: 1
  };

  showModalAddMovie = false;

  onImageSelect(event: any, type: 'landscape' | 'portrait') {
    const file = event.target.files[0];
    if (file) {
      // TODO: Upload ảnh và gán link cho imageLandscape/imagePortrait
      // Ví dụ: dùng FormData và gọi API upload
    }
  }

  searchCinemaHallByCinemaId() {
    this.cinemaHallService.searchCinemaHallByCinemaId('fb233b0f-edb4-4eb1-ade8-7f8b83ab2457', 1, 10, 'ASC')
      .subscribe({
          next: (res) => {
            const data = res.responseData;
            this.cinemaHalls = data.rows ?? [];
            this.page = data.page;
            this.take = data.take;
            this.pageCount = data.pageCount;
            this.hasPreviousPage = data.hasPreviousPage;
            this.hasNextPage = data.hasNextPage;
            console.log(this.cinemaHalls)
          },
          error: (error) => {
            console.error('Lỗi khi lấy danh sách phim:', error);
          }
        }
      )
  }




  getMovies() {
    this.movieService.searchMovies(this.name, this.page, this.take, 'ASC')
      .subscribe({
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
        }
      )
  }

  modalVisible = false;
  selectedMovieId: string = '';
  selectedMovieName: string = '';

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
    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    const file = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAs(file, 'danhsachrap.xlsx');
  }

  exportCSV(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const file = new Blob([csv], {type: 'text/csv'});
    saveAs(file, 'danhsachphim.csv');
  }

  editMovieForm: any = {};
  showModalEditMovie = false;

  getMockMovie() {
    return {
      id: '1',
      name: 'Inception',
      age: 16,
      duration: 148,
      imageLandscape: 'https://cdn.galaxycine.vn/media/2025/3/19/mat-vu-phu-ho-500_1742357908078.jpg',
      imagePortrait: 'https://cdn.galaxycine.vn/media/2025/3/19/mat-vu-phu-ho-750_1742357908696.jpg',
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
      categoryIds: 'Kinh di',
    };
  }
  openEditMovieModal(movie: any) {
    this.editMovieForm = { ...movie };
    this.showModalEditMovie = true;
  }


}
