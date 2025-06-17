import {Component, inject, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {CinemaService} from '../../../../../service/cinema/api/cinema.service';
import {Router} from '@angular/router';
import {CinemaApi} from '../../../../../service/cinema/model/cinema.model';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';

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

  cinemaForm = {
    name: '',
    slug: '',
    latitude: 0,
    longitude: 0,
    address: '',
    phone: '',
    imageLandscape: '',
    imagePortrait: '',
    imgUrlsString: '',
    sortOrder: 0,
  };
  showModalAddCinema = false

  onImageSelect(event: any, type: 'landscape' | 'portrait') {
    const file = event.target.files[0];
    // Xử lý upload file tại đây hoặc tạo URL giả để demo
    const fakeUrl = URL.createObjectURL(file);
    if (type === 'landscape') {
      this.cinemaForm.imageLandscape = fakeUrl;
    } else {
      this.cinemaForm.imagePortrait = fakeUrl;
    }
  }

  submitAddCinema() {
    const imgUrlsArray = this.cinemaForm.imgUrlsString
      ? this.cinemaForm.imgUrlsString.split(',').map(url => url.trim())
      : [];

    const payload = {
      ...this.cinemaForm,
      imgUrls: imgUrlsArray
    };

    console.log('Dữ liệu gửi đi:', payload);
    // Gửi API tại đây
    this.showModalAddCinema = false;
  }
  showModalEditCinema = false;
  editCinemaForm = {
    name: "Galaxy Nguyễn Du",
    slug: "galaxy-nguyen-du",
    latitude: 10.77339,
    longitude: 106.69329,
    address: "116 Nguyễn Du, Quận 1, Tp.HCM",
    phone: "1900 2224",
    imageLandscape: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-3_1698051874807.jpg",
    imagePortrait: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-1_1698051870157.jpg",
    sortOrder: 1,
    imgUrlsText: `https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-1_1698051240852.jpg
                  https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-4_1698051246666.jpg
                  https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-2_1698051251352.jpg
                  https://cdn.galaxycine.vn/media/2023/10/23/galaxy-nguyen-du-3_1698051255427.jpg`
  };

}
