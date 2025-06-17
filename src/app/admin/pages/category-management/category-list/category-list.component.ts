import {Component, inject, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {CategoryService} from '../../../../../service/category/api/category.service';
import {MovieApi} from '../../../../../service/movie/model/movie.model';
import {CategoryApi} from '../../../../../service/category/model/category.model';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./category-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  categories: CategoryApi.Response[] = [];
  searchInputChanged = new Subject<string>();
  name: string = "";
  page: number = 1;
  take: number = 10;
  pageCount: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;

  ngOnInit(): void {
    this.getCategories();
    this.searchInputChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.name = value;
        this.page = 1;
        this.getCategories();
      });
  }

  getCategories() {
    this.categoryService.searchCategory(this.name, this.page, this.take, 'ASC')
      .subscribe({
          next: (res) => {
            const data = res.responseData;
            this.categories = data.rows ?? [];
            this.page = data.page;
            this.take = data.take;
            this.pageCount = data.pageCount;
            this.hasPreviousPage = data.hasPreviousPage;
            this.hasNextPage = data.hasNextPage;
            console.log(this.categories)
          },
          error: (error) => {
            console.error('Lỗi khi lấy danh sách phim:', error);
          }
        }
      )
  }

  modalVisible = false;
  selectedCategoryId: string = '';
  selectedCategoryName: string = '';

  openDeleteModal(id: string, name: string): void {
    this.selectedCategoryId = id;
    this.selectedCategoryName = name;
    this.modalVisible = true;
  }

  confirmDeleteCategory(): void {
    this.categoryService.deleteCategory(this.selectedCategoryId).subscribe({
      next: () => {
        this.modalVisible = false;
        this.getCategories();
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
      this.getCategories();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage && this.page > 1) {
      this.page--;
      this.getCategories();
    }
  }


  exportExcel(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachDanhMuc');
    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    const file = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAs(file, 'danhsachdanhmuc.xlsx');
  }

  exportCSV(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const file = new Blob([csv], {type: 'text/csv'});
    saveAs(file, 'danhsachdanhmuc.csv');
  }


  showModalAddCategory = false;

  categoryForm = {
    name: '',
    slug: '',
    description: ''
  };

  openAddModal() {
    this.showModalAddCategory = true;
  }

  closeAddModal() {
    this.showModalAddCategory = false;
    this.resetForm();
  }

  resetForm() {
    this.categoryForm = {
      name: '',
      slug: '',
      description: ''
    };
  }

  submitCategory() {

    console.log('Thêm thể loại:', this.categoryForm);
    this.closeAddModal();
  }


  showModalEditCategory = false;

  categoryForm2 = {
    name: '',
    slug: '',
    description: ''
  };

  openEditModal() {
    // Gán dữ liệu sẵn để demo
    this.categoryForm2 = {
      name: 'Kinh dị',
      slug: 'kinh-di',
      description: 'Thể loại phim mang đến cảm giác hồi hộp, sợ hãi.'
    };
    this.showModalEditCategory = true;
  }

  closeEditModal() {
    this.showModalEditCategory = false;
  }

  submitEditCategory() {
    // TODO: Gửi dữ liệu cập nhật lên API
    console.log('Dữ liệu chỉnh sửa:', this.categoryForm);
    this.closeEditModal();
  }

}
