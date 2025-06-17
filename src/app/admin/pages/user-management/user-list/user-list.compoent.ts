import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../../../../../service/user/api/user.service';
import {CinemaApi} from '../../../../../service/cinema/model/cinema.model';
import {UserApi} from '../../../../../service/user/model/user.model';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';

@Component({
  selector: 'user-management-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass
  ]
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
    ngOnInit(): void {
      this.getUsers();
      this.searchInputChanged
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((value) => {
          this.name = value;
          this.page = 1;
          this.getUsers();
        });
    }
  users: UserApi.Response[] = [];
  name: string = '';
  page: number = 1;
  take: number = 10;
  pageCount: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;
  searchInputChanged = new Subject<string>();
  getUsers(): void {
    this.userService
      .searchUser(this.name, this.page, this.take, 'ASC')
      .subscribe({
        next: (res) => {
          const data = res.responseData;
          this.users = data.rows ?? [];
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
  selectedUserId: string = '';
  selectedUserName: string = '';
  openDeleteModal(id: string, name: string): void {
    this.selectedUserId = id;
    this.selectedUserName = name;
    this.modalVisible = true;
  }
  confirmDeleteCinema(): void {
    this.userService.deleteUser(this.selectedUserId).subscribe({
      next: () => {
        this.modalVisible = false;
        this.getUsers()
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
      this.getUsers();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage && this.page > 1) {
      this.page--;
      this.getUsers();
    }
  }
  exportExcel(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachNguoiDung');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'danhsachnguoidung.xlsx');
  }
  exportCSV(): void {
    const table = document.querySelector('table') as HTMLTableElement;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const file = new Blob([csv], { type: 'text/csv' });
    saveAs(file, 'danhsachnguoidung.csv');
  }


}
