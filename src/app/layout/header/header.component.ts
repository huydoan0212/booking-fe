  import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
  import {NgClass, NgForOf, NgIf} from '@angular/common';
  import {Router, RouterLink} from '@angular/router';
  import {FormsModule} from '@angular/forms';
  import {AuthService} from '../../../service/auth/auth.service';
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
    ngOnInit(): void {

    }
    isMenuOpen = false;
    menuItems = [
      { label: 'Phim', withPadding: true },
      { label: 'Rạp/Giá vé', withPadding: false }
    ];
    isLoginModalOpen = false;
    isRegisterModalOpen = false;
    showSearch = false;

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    loginCredentials = {
      email: '',
      password: '',
    };

    onLoginSubmit(): void {
      if (!this.loginCredentials.email || !this.loginCredentials.password) {
        alert('Vui lòng nhập đầy đủ email và mật khẩu.');
        return;
      }
      this.authService.sendLoginForm(this.loginCredentials).subscribe({
        next: (response) => {
          this.authService.saveUserInfo()
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
    }

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
    goToHome() {
      this.router.navigate(['/home']);
    }
  }
