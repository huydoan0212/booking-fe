import {Component, inject, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {CinemaService} from '../../../../../service/cinema/api/cinema.service';
import {Router} from '@angular/router';
import {CinemaApi} from '../../../../../service/cinema/model/cinema.model';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {MovieApi} from '../../../../../service/movie/model/movie.model';
import {UploadService} from '../../../../../service/upload/upload.service';

@Component({
  selector: 'app-cinema-list',
  templateUrl: './cinema-list.component.html',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
  ],
  styleUrls: ['./cinema-management.component.css']
})
export class CinemaListComponent implements OnInit {
  private readonly cinemaService = inject(CinemaService);
  private readonly uploadService = inject(UploadService);
  private readonly router = inject(Router);
  searchInputChanged = new Subject<string>();

  ngOnInit(): void {
    this.getCinemas();
    this.searchInputChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.name = value;
        this.page = 1;
        this.getCinemas();
      });
  }

  cinemas: CinemaApi.Response[] = [];
  name: string = '';
  page: number = 1;
  take: number = 10;
  pageCount: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;

  getCinemas(): void {
    this.cinemaService
      .searchCinema(this.name, this.page, this.take, 'ASC')
      .subscribe({
        next: (res) => {
          const data = res.responseData;
          this.cinemas = data.rows ?? [];
          this.page = data.page;
          this.take = data.take;
          this.pageCount = data.pageCount;
          this.hasPreviousPage = data.hasPreviousPage;
          this.hasNextPage = data.hasNextPage;
        },
        error: (error) => {
          console.error('Lỗi khi lấy danh sách rạp:', error);
        }
      });
  }

  modalVisible = false;
  selectedCinemaId: string = '';
  selectedCinemaName: string = '';

  openDeleteModal(id: string, name: string): void {
    this.selectedCinemaId = id;
    this.selectedCinemaName = name;
    this.modalVisible = true;
  }

  confirmDeleteCinema(): void {
    this.cinemaService.deleteCinema(this.selectedCinemaId).subscribe({
      next: () => {
        this.modalVisible = false;
        this.getCinemas();
      },
      error: (err) => {
        console.error('Lỗi khi xoá:', err);
        this.modalVisible = false;
      }
    });
  }

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
  showModalAddCinema = false;

  submitAddCinema() {
    this.cinemaService.createCinema(this.cinemaForm).subscribe({
      next: () => {
        this.getCinemas();
        this.showModalAddCinema = false;
      },
      error: (err) => {
        console.error('Lỗi khi thêm rạp:', err);
      }
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

  nextPage(): void {
    if (this.hasNextPage) {
      this.page++;
      this.getCinemas();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage && this.page > 1) {
      this.page--;
      this.getCinemas();
    }
  }

  goToEditCinema(cinemaId: string): void {
    this.router.navigate(['/admin/cinema-detail', cinemaId]);
  }

  exportExcel(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachRap');
    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    const file = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAs(file, 'danhsachrap.xlsx');
  }

  exportCSV(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const file = new Blob([csv], {type: 'text/csv'});
    saveAs(file, 'danhsachrap.csv');
  }
}
