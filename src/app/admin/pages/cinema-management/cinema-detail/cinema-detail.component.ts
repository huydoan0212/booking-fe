import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {CinemaService} from '../../../../../service/cinema/api/cinema.service';
import {MovieApi} from '../../../../../service/movie/model/movie.model';
import {CinemaApi} from '../../../../../service/cinema/model/cinema.model';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {UploadService} from '../../../../../service/upload/upload.service';
import {CinemaHallApi} from '../../../../../service/cinemaHall/model/cinemalHall.model';
import {CinemaHallService} from '../../../../../service/cinemaHall/api/cinemalHall.service';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {ShowtimeService} from '../../../../../service/showtime/api/showtime.service';
import {ShowTimeApi} from '../../../../../service/showtime/model/showtime.model';
import {MovieService} from '../../../../../service/movie/api/movie.service';

@Component({
  selector: 'cinema-detail',
  templateUrl: './cinema-detail.component.html',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    DatePipe
  ],
  styleUrls: ['./cinema-detail.component.css']

})
export class CinemaDetailComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();
  cinemaId: string = '';
  searchInputChanged = new Subject<string>();
  ngOnInit(): void {
      this.getCinemaId();
      this.searchCinemaHallByCinemaId();
      this.loadShowTimes();
      this.getMovies();
  }
  private readonly cinemaService = inject(CinemaService);
  cinemaDetail: CinemaApi.Response | null = null;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly uploadService = inject(UploadService);
  private readonly cinemaHallService = inject(CinemaHallService);
  private readonly showtimeService = inject(ShowtimeService);
  private readonly movieService = inject(MovieService);
  cinemaHalls: CinemaHallApi.Response[] = [];
  showTimes: ShowTimeApi.Response[] = [];
  movies: MovieApi.Response[] = [];


  cinemaForm: CinemaApi.Request = {
    name: '',
    slug: '',
    latitude: 0,
    longitude: 0,
    address: '',
    phone: '',
    imageLandscape: '',
    imagePortrait: '',
    imgUrls: [],
    sortOrder: 0
  };
  mapDetailToForm(detail: CinemaApi.Response): void {
    this.cinemaForm = {
      name: detail.name || '',
      slug: detail.slug || '',
      latitude: detail.latitude || 0,
      longitude: detail.longitude || 0,
      address: detail.address || '',
      phone: detail.phone || '',
      imageLandscape: detail.imageLandscape || '',
      imagePortrait: detail.imagePortrait || '',
      imgUrls: detail.imgUrls || [],
      sortOrder: detail.sortOrder || 0
    };
  }

  getCinemaId(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.cinemaId = id;
          this.getCinemaDetail(this.cinemaId);
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy ID từ URL:', err);
      },
    });
  }

  getCinemaDetail(id: string): void {
    this.cinemaService.getCinemaDetail(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.cinemaDetail = res.responseData;
        console.log(this.cinemaDetail);
        this.mapDetailToForm(this.cinemaDetail!)
      },
      error: (err) => {
        console.error('Lỗi khi gọi API chi tiết phim:', err);
        alert('Không thể tải chi tiết phim!');
      },
    });
  }
  onImageSelect(event: any, type: 'landscape' | 'portrait') {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (res) => {
          const url = res.responseData?.url;
          if (type === 'landscape') {
            this.cinemaForm.imageLandscape = url;
          } else {
            this.cinemaForm.imagePortrait = url;
          }
        },
      });
    }
  }
  showSuccessModal = false
  submitEditMovie(): void {
    if (!this.cinemaForm.name || !this.cinemaForm.slug) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    this.cinemaService.updateCinema(this.cinemaId, this.cinemaForm).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.showSuccessModal = true;
        console.log('Cập nhật thành công:', res);
        this.getCinemaId();
      },
      error: (err) => {
        console.error('Lỗi cập nhật:', err);
        alert('Cập nhật thất bại: ' + (err.error?.message || 'Lỗi không xác định'));
      },
    });
  }
  name: string = '';
  page: number = 1;
  take: number = 10;
  pageCount: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;

  nextPage(): void {
    if (this.hasNextPage) {
      this.page++;
      this.searchCinemaHallByCinemaId();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage && this.page > 1) {
      this.page--;
      this.searchCinemaHallByCinemaId();
    }
  }

  searchCinemaHallByCinemaId() {
    this.cinemaHallService.searchCinemaHallByCinemaId(this.cinemaId, 1, 10, 'ASC').subscribe({
      next: (res) => {
        const data = res.responseData;
        this.cinemaHalls = data.rows ?? [];
        this.page = data.page;
        this.take = data.take;
        this.pageCount = data.pageCount;
        this.hasPreviousPage = data.hasPreviousPage;
        this.hasNextPage = data.hasNextPage;
        console.log(this.cinemaHalls);
      },
      error: (err) => console.error('Lỗi khi lấy danh sách phòng chiếu:', err),
    });
  }
  cinemaHallForm: CinemaHallApi.Request = {
    name: '',
    screenType: '',
    soundSystem: '',
    cinemaId: '',
  };
  showModalAddCinema = false;
  closeAddModal() {
    this.showModalAddCinema = false;

  }
  openAddModal() {
    this.showModalAddCinema  = true;
  }

  submitCinemaHall() {
    this.cinemaHallForm.cinemaId = this.cinemaId;
    this.cinemaHallService.createCinemaHall(this.cinemaHallForm).subscribe({
      next: (response) => {
        this.closeAddModal();
        this.searchCinemaHallByCinemaId();
        console.log(response);
      },
      error: (error) => {
        console.error('Lỗi khi tạo cinemahall:', error);
      }
    });
  }

  loadShowTimes(): void {
    this.showtimeService.getShowTimeByCinemaHallId(this.page, this.take, 'ASC')
      .subscribe({
        next: (res) => {
          this.showTimes = res.responseData?.rows ;
        },
        error: (err) => {
          console.error('Error loading showtimes:', err);
        }
      });
  }
  showtimeForm: ShowTimeApi.Request = {
    movieId: '',
    cinemaHallId: '',
    showTime: '',
    language: '',
    subtitle: '',
    screenFormat: ''
  };
  showModalAddShowtime = false;
  closeAddShowtime() {
    this.showModalAddShowtime = false;
  }
  openAddShowtime(id: string) {
    this.showModalAddShowtime = true;
    this.showtimeForm.cinemaHallId = id;
  }
  submitShowtime() {
    const inputValue = this.showtimeForm.showTime;
    this.showtimeForm.showTime = `${inputValue}:00+07:00`;
    console.table(this.showtimeForm);
    this.showtimeService.createShowtime(this.showtimeForm).subscribe({
      next: (response) => {
        this.closeAddShowtime();
        console.log('Thành công:', response);
      },
      error: (error) => {
        console.error('Lỗi khi tạo showtime:', error);
      }
    });
  }

  getMovies(): void {
    this.movieService.getMovies('', 1, 10, 'ASC')
      .subscribe({
        next: (res: any) => {
          this.movies = res.responseData.rows;
        },
        error: (err) => {
          console.error('Error loading movies', err);
        }
      });
  }
  cinemaHallEditForm: CinemaHallApi.Request = {
    name: '',
    screenType: '',
    soundSystem: '',
    cinemaId: '',
  };
  selectedCinemaHallId : string = '';
  showModalEditCinemaHall = false;
  closeEditCinemaHall(): void {
    this.showModalEditCinemaHall = false;
  }
  openEditCinemaHallModal(id: string) {
    this.selectedCinemaHallId = id;
    this.cinemaHallService.getCinemaHallById(id).subscribe({
      next: (res) => {
        const cinemaHall = res.responseData;
        if (cinemaHall) {
          this.cinemaHallEditForm = {
            name: cinemaHall.name,
            screenType: cinemaHall.screenType,
            soundSystem: cinemaHall.soundSystem,
            cinemaId: this.cinemaId,
          };
          this.showModalEditCinemaHall = true;
        } else {
          console.warn('Không có dữ liệu thể loại');
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết category:', err);
      }
    });
  }
  submitEditCategory() {
    this.cinemaHallService.updateCinemaHall(this.selectedCinemaHallId, this.cinemaHallEditForm).subscribe({
      next: (res) => {
        console.log('Cập nhật thành công:', res);
        this.closeEditCinemaHall();
        this.searchCinemaHallByCinemaId();
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
      }
    });
  }
  showtimeEditForm: ShowTimeApi.Request = {
    movieId: '',
    cinemaHallId: '',
    showTime: '',
    language: '',
    subtitle: '',
    screenFormat: ''
  };
  selectedShowtimeId : string = '';
  showModalEditShowtime = false;
  closeEditShowtime(): void {
    this.showModalEditShowtime = false;
  }
  openEditShowTimeModal(id: string) {
    this.selectedShowtimeId  = id;
    this.showtimeService.getShowTimeId(id).subscribe({
      next: (res) => {
        console.log(res);
        const showtime = res.responseData;
        if (showtime) {
          this.showtimeEditForm= {
            movieId: showtime.movie.id,
            cinemaHallId: showtime.cinemaHall.id,
            showTime:showtime.showTime,
            language:showtime.language,
            subtitle:showtime.subtitle,
            screenFormat: showtime.screenFormat
          };
          this.showModalEditShowtime = true;
        } else {
          console.warn('Không có dữ liệu thể loại');
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết category:', err);
      }
    });
  }
  submitEditShowtime() {
    const inputValue = this.showtimeEditForm.showTime;
    if (inputValue && !inputValue.includes('+07:00')) {
      this.showtimeEditForm.showTime = inputValue + ':00+07:00';
    }
    this.showtimeService.updateShowtime(this.selectedShowtimeId , this.showtimeEditForm).subscribe({
      next: (res) => {
        console.log('Cập nhật thành công:', res);
        this.closeEditShowtime();
        this.loadShowTimes();
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
      }
    });
  }
  modalVisible = false;
  selectedCinemaHallName : string = '';
  openDeleteCinemaHallModal(id: string, name: string): void {
    this.selectedCinemaHallId= id;
    this.selectedCinemaHallName = name;
    this.modalVisible = true;
  }

  confirmDeleteCinemaHall(): void {
    this.cinemaHallService.deleteCinemaHall(this.selectedCinemaHallId).subscribe({
      next: (res) => {
        console.log(res);
        this.modalVisible = false;
        this.searchCinemaHallByCinemaId();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  modalVisibleShowtime = false;
  selectedShowtimeName : string = '';
  selectedShowtimeIdDelete: string = '';
  openDeleteShowtimeModal(id: string, name: string): void {
    this.selectedShowtimeIdDelete= id;
    this.selectedShowtimeName = name;
    this.modalVisibleShowtime = true;
  }

  confirmDeleteShowtime(): void {
    console.log(this.selectedShowtimeIdDelete)
    this.showtimeService.deleteShowtime(this.selectedShowtimeIdDelete).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }


}

