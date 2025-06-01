import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';

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
export class HeaderComponent {
  isMenuOpen = false;
  isLoginModalOpen = false;
  isRegisterModalOpen = false;
  showSearch = false;

  menuItems = [
    { label: 'Phim', withPadding: true },
    { label: 'Rạp/Giá vé', withPadding: false }
  ];

  loginCredentials = {
    username: '',
    password: '',
  };

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild('searchInput') searchInputRef!: ElementRef;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleLoginModal(): void {
    this.isLoginModalOpen = !this.isLoginModalOpen;
    if (this.isLoginModalOpen) {
      this.isRegisterModalOpen = false;
    }
  }

  toggleRegisterModal(): void {
    this.isRegisterModalOpen = !this.isRegisterModalOpen;
    if (this.isRegisterModalOpen) {
      this.isLoginModalOpen = false;
    }
  }

  openRegisterModal(): void {
    this.isRegisterModalOpen = true;
    this.isLoginModalOpen = false;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 0);
    }
  }

  onLoginSubmit(): void {
    const { username, password } = this.loginCredentials;
    if (!username || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    this.authService.sendLoginForm(this.loginCredentials).subscribe({
      next: (response) => {
        console.log(this.loginCredentials);
        this.authService.saveUserInfo();
        this.router.navigate(['/home']);
        this.isLoginModalOpen = false;
        console.log('Login success', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
