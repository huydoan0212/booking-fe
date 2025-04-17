  import { Component, OnInit } from '@angular/core';
  import { CinemaApi } from '../../../../service/cinema/model/cinema.model';
  import {NgClass, NgForOf, NgIf} from '@angular/common';
  import { Router } from '@angular/router';
  @Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
      NgClass,
      NgForOf,
      NgIf
    ]
  })
  export class HeaderComponent implements OnInit {
    isMenuOpen = false;
    menuItems = [
      { label: 'Phim', withPadding: true },
      { label: 'Rạp/Giá vé', withPadding: false }
    ];

    ngOnInit() {
    }

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
    constructor(private router: Router) {} // Inject Router vào constructor

    // Phương thức này sẽ điều hướng về trang Home
    goToHome() {
      this.router.navigate(['/']); // Điều hướng về trang chủ (home)
    }
  }
