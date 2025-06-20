import {Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {CommonModule, isPlatformBrowser, NgClass, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../service/auth/auth.service';
import {CategoryService} from '../../../../service/category/api/category.service';
import {CategoryApi} from '../../../../service/category/model/category.model';
import {CinemaService} from '../../../../service/cinema/api/cinema.service';
import {CinemaApi} from '../../../../service/cinema/model/cinema.model';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgClass, NgIf, FormsModule, RouterLink, NgForOf, CommonModule]
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly categoryService = inject(CategoryService);
  private readonly cinemaService = inject(CinemaService);
  private readonly router = inject(Router);
  categories: CategoryApi.Response[] = [];
  cinemas: CinemaApi.Response[] = [];
  ngOnInit(): void {
    this.getCategories();
    this.getCinemas();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCinemas(): void {
    this.cinemaService.getAllCinema().subscribe({
      next: (data) => {
        this.cinemas = data ?? [];
      },
      error: (error) => {
        console.error('Lỗi khi lấy thể loại:', error);
      }
    });
  }


  dropdownOpen = false;
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onCategorySelect(category: CategoryApi.Response): void {
    this.router.navigate(['/movies-by-category', category.id]);
  }

  getCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data ?? [];
      },
      error: (error) => {
        console.error('Lỗi khi lấy thể loại:', error);
      }
    });
  }
  onSearch(query: string): void {
    const trimmed = query.trim();
    if (trimmed) {
      this.router.navigate(['/search'], {
        queryParams: { q: trimmed }
      });
    }
  }

  isMenuOpen = false;
  showSearch = false;

  isLoginModalOpen = false;
  isRegisterModalOpen = false;
  isOtpModalOpen = false;
  isForgotModalOpen = false;
  isOtpForgotModalOpen = false;
  isResetPasswordModalOpen = false;

  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  getToken(): string | null {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      return localStorage.getItem('token');
    } else {
      return null;
    }
  }

  loginCredentials = {
    username: '',
    password: '',
  };

  registerCredentials = {
    name: '',
    username: '',
    idNumber: '',
    gender: '1',
    dob: '2024-12-31',
    password: '',
    confirmPassword: ''
  };

  otpCode: string = '';
  otpUsername = '';
  otpErrorMessage: string = '';
  emailForgot: string = '';
  tokenForgot: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordMismatch: boolean = false;

  @ViewChild('searchInput') searchInputRef!: ElementRef;



  closeAllModals(): void {
    this.isLoginModalOpen = false;
    this.isRegisterModalOpen = false;
    this.isOtpModalOpen = false;
    this.isForgotModalOpen = false;
    this.isOtpForgotModalOpen = false;
    this.isResetPasswordModalOpen = false;
  }

  openLoginModal(): void {
    this.closeAllModals();
    this.isLoginModalOpen = true;
  }

  openRegisterModal(): void {
    this.closeAllModals();
    this.isRegisterModalOpen = true;
  }

  openOtpModal(): void {
    this.closeAllModals();
    this.isOtpModalOpen = true;
  }

  openForgotModal(): void {
    this.closeAllModals();
    this.isForgotModalOpen = true;
  }

  openOtpForgotModal(): void {
    this.closeAllModals();
    this.isOtpForgotModalOpen = true;
  }

  openResetPasswordModal(): void {
    this.closeAllModals();
    this.isResetPasswordModalOpen = true;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 0);
    }
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  generateRandom7DigitString(): string {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }
  isLoading = false;

  onLoginSubmit(): void {
    this.isLoading = true;
    this.authService.sendLoginForm(this.loginCredentials).subscribe({
      next: (response) => {
        const token = response?.responseData?.token;
        this.isLoading = false;
        if (token) {
          this.authService.setToken(token);
          this.authService.redirectToBasedOnRole();
          this.closeAllModals();
          console.log('Login success', response);
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.isLoading = false;
      }
    });
  }



  onRegisterSubmit(): void {
    this.isLoading = true;
    this.registerCredentials.idNumber = this.generateRandom7DigitString();
    this.authService.sendRegisterForm(this.registerCredentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.otpUsername = this.registerCredentials.username;
        this.openOtpModal();
        console.log('Register success', response);
      },
      error: (error) => {
        console.error('Register failed', error);
        this.isLoading = false;
      }
    });
  }

  onOtpSubmit(): void {
    this.isLoading = true;
    this.authService.sendOTPForm(this.otpUsername, this.otpCode, 'REGISTER').subscribe({
      next: (response) => {
        this.isLoading = false;
        this.openLoginModal();
        this.otpCode = '';
        this.otpErrorMessage = '';
        console.log('OTP success', response);
      },
      error: (error) => {
        console.error('OTP failed', error);
        this.otpErrorMessage = 'Sai mã xác minh. Vui lòng thử lại.';
        this.isLoading = false;
      }
    });
  }

  onForgotPassword(): void {
    this.isLoading = true;
    this.authService.sendForgotPassword(this.emailForgot).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.openOtpForgotModal();
        console.log('ForgotPassword success', response);
      },
      error: (error) => {
        console.error('ForgotPassword failed', error);
        this.isLoading = false;
      }
    });
  }

  onOtpForgotSubmit(): void {
    this.isLoading = true;
    this.authService.sendOTPForm(this.emailForgot, this.otpCode, 'FORGOT_PASSWORD').subscribe({
      next: (response) => {
        this.isLoading = false;
        this.closeAllModals();
        this.otpCode = '';
        this.otpErrorMessage = '';
        this.tokenForgot = response.responseData.token;
        this.openResetPasswordModal();
        console.log('OTP (forgot) success', this.tokenForgot);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('OTP (forgot) failed', error);
        this.otpErrorMessage = 'Sai mã xác minh. Vui lòng thử lại.';
      }
    });
  }

  onResetPasswordSubmit(): void {
    this.isLoading = true;
    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;
    this.authService.sendResetPassword(this.tokenForgot, this.newPassword, this.confirmNewPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.openLoginModal();
        console.log('Reset password success', response);
      },
      error: (error) => {
        console.error('Reset password failed', error);
        this.isLoading = false;
      }
    })

  }

}
