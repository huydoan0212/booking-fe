import { Component, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CategoryService } from '../../../../../service/category/api/category.service';
import { CategoryApi } from '../../../../../service/category/model/category.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ]
})
export class CategoriesListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  categoryForm = {
    name: '',
    slug: '',
    description: ''
  };

  categoryFormEdit = {
    name: '',
    slug: '',
    description: ''
  };

  showModalAddCategory = false;
  showModalEditCategory = false;
  modalVisible = false;

  selectedCategoryId: string = '';
  selectedCategoryName: string = '';

  categories: CategoryApi.Response[] = [];
  name: string = '';
  searchInputChanged = new Subject<string>();
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
    this.categoryService.createCategory(this.categoryForm).subscribe({
      next: (response) => {
        this.closeAddModal();
        this.getCategories();
      },
      error: (error) => {
        console.error('Lỗi khi tạo category:', error);
      }
    });
  }

  closeEditModal() {
    this.showModalEditCategory = false;
  }
  openEditModal(id: string) {
    this.selectedCategoryId = id;

    this.categoryService.getCategoryById(id).subscribe({
      next: (res) => {
        const category = res.responseData;
        if (category) {
          this.categoryFormEdit = {
            name: category.name,
            slug: category.slug,
            description: category.description
          };
          this.showModalEditCategory = true;
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
    this.categoryService.updateCategory(this.selectedCategoryId, this.categoryFormEdit).subscribe({
      next: (res) => {
        console.log('Cập nhật thành công:', res);
        this.closeEditModal();
        this.getCategories();
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
      }
    });
  }




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

  getCategories() {
    this.categoryService.searchCategory(this.name, this.page, this.take, 'ASC').subscribe({
      next: (res) => {
        const data = res.responseData;
        this.categories = data.rows ?? [];
        this.page = data.page;
        this.take = data.take;
        this.pageCount = data.pageCount;
        this.hasPreviousPage = data.hasPreviousPage;
        this.hasNextPage = data.hasNextPage;
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
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
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'danhsachdanhmuc.xlsx');
  }

  exportCSV(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const file = new Blob([csv], { type: 'text/csv' });
    saveAs(file, 'danhsachdanhmuc.csv');
  }
}
