  import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
  import {NgClass, NgForOf, NgIf} from '@angular/common';
  import { Router } from '@angular/router';
  import {FormsModule} from '@angular/forms';
  @Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
      NgClass,
      NgForOf,
      NgIf,
      FormsModule,
    ]
  })
  export class HeaderComponent implements OnInit {
    constructor(private router: Router) {}
    isMenuOpen = false;
    menuItems = [
      { label: 'Phim', withPadding: true },
      { label: 'Rạp/Giá vé', withPadding: false }
    ];
    isLoginModalOpen = false;
    isRegisterModalOpen = false;
    showSearch = false;

    @ViewChild('searchInput') searchInputRef!: ElementRef;

    toggleSearch(): void {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        setTimeout(() => {
          this.searchInputRef?.nativeElement?.focus();
        });
      }
    }
    toggleMenu(): void {

    }
    toggleLoginModal(): void {
      if (this.isLoginModalOpen) {
        this.isLoginModalOpen = false;
      } else {
        this.isLoginModalOpen = true;
        this.isRegisterModalOpen = false;
      }
    }

    toggleRegisterModal(): void {
      if (this.isRegisterModalOpen) {
        this.isRegisterModalOpen = false;
      } else {
        this.isRegisterModalOpen = true;
        this.isLoginModalOpen = false;
      }
    }
    openRegisterModal(): void {
      this.isRegisterModalOpen = true;
      this.isLoginModalOpen = false;
    }


    onLoginSubmit(): void {

    }
    ngOnInit() {

    }
    loginCredentials: any;
    goToHome() {
      this.router.navigate(['/home']);
    }
  }
