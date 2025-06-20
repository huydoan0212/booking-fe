import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MovieService } from '../../../../../service/movie/api/movie.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieApi } from '../../../../../service/movie/model/movie.model';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {CategoryApi} from '../../../../../service/category/model/category.model';
import {CategoryService} from '../../../../../service/category/api/category.service';
import {UploadService} from '../../../../../service/upload/upload.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  providers: [DatePipe],
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  private readonly movieService = inject(MovieService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly uploadService = inject(UploadService);
  private readonly destroy$ = new Subject<void>();

  movieDetail: MovieApi.Response | null = null;
  movieId: string = '';
  categories: CategoryApi.Response[] = [];

  movieForm: MovieApi.Request = {
    name: '',
    age: 0,
    duration: 0,
    imageLandscape: '',
    imagePortrait: '',
    slug: '',
    rate: 0,
    totalVotes: 0,
    views: 0,
    description: '',
    sortOrder: 0,
    actors: '',
    director: '',
    producers: '',
    country: '',
    trailer: '',
    status: 1,
    startDate: '',
    endDate: '',
    categoryIds: [],
  };

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getMovieId();
    this.getCategories();

  }

  getCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data ?? [];
      },
      error: (err) => console.error('Lỗi khi lấy thể loại:', err),
    });
  }


  getMovieId(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.movieId = id;
          this.getMovieDetails(this.movieId);
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy ID từ URL:', err);
      },
    });
  }

  getMovieDetails(id: string): void {
    this.movieService.getMovieDetail(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.movieDetail = res.responseData;
        this.mapDetailToForm(this.movieDetail!);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Lỗi khi gọi API chi tiết phim:', err);
        alert('Không thể tải chi tiết phim!');
      },
    });
  }

  mapDetailToForm(detail: MovieApi.Response): void {
    this.movieForm = {
      name: detail.name,
      age: detail.age,
      duration: detail.duration,
      imageLandscape: detail.imageLandscape,
      imagePortrait: detail.imagePortrait,
      slug: detail.slug,
      rate: detail.rate,
      totalVotes: detail.totalVotes,
      views: detail.views,
      description: detail.description,
      sortOrder: detail.sortOrder,
      actors: detail.actors,
      director: detail.director,
      producers: detail.producers,
      country: detail.country,
      trailer: '',
      status:  1,
      startDate: this.datePipe.transform(detail.startDate, 'yyyy-MM-dd') || '',
      endDate: this.datePipe.transform(detail.endDate, 'yyyy-MM-dd') || '',
      categoryIds: detail.categories?.map((c) => c.id) || [],
    };
  }

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
        },
      });
    }
  }
  showSuccessModal = false;
  submitEditMovie(): void {
    this.movieForm.startDate = `${this.movieForm.startDate}T00:00:00Z`;
    this.movieForm.endDate = `${this.movieForm.endDate}T00:00:00Z`;
    if (!this.movieForm.name || !this.movieForm.slug) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    this.movieService.updateMovie(this.movieId, this.movieForm).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.showSuccessModal = true;
        console.log('Cập nhật thành công:', res);
        this.getMovieId();
      },
      error: (err) => {
        console.error('Lỗi cập nhật:', err);
        alert('Cập nhật thất bại: ' + (err.error?.message || 'Lỗi không xác định'));
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
