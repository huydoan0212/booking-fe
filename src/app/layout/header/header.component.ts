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
  imports: [NgClass, NgIf, FormsModule]
})
export class HeaderComponent {
  isMenuOpen = false;
  showSearch = false;

  isLoginModalOpen = false;
  isRegisterModalOpen = false;
  isOtpModalOpen = false;
  isForgotModalOpen = false;
  isOtpForgotModalOpen = false;

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

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild('searchInput') searchInputRef!: ElementRef;

  closeAllModals(): void {
    this.isLoginModalOpen = false;
    this.isRegisterModalOpen = false;
    this.isOtpModalOpen = false;
    this.isForgotModalOpen = false;
    this.isOtpForgotModalOpen = false;
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

  onLoginSubmit(): void {
    this.authService.sendLoginForm(this.loginCredentials).subscribe({
      next: (response) => {
        this.authService.saveUserInfo();
        this.router.navigate(['/home']);
        this.closeAllModals();
        console.log('Login success', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  onRegisterSubmit(): void {
    this.registerCredentials.idNumber = this.generateRandom7DigitString();
    this.authService.sendRegisterForm(this.registerCredentials).subscribe({
      next: (response) => {
        this.otpUsername = this.registerCredentials.username;
        this.openOtpModal();
        console.log('Register success', response);
      },
      error: (error) => {
        console.error('Register failed', error);
      }
    });
  }

  onOtpSubmit(): void {
    this.authService.sendOTPForm(this.otpUsername, this.otpCode, 'REGISTER').subscribe({
      next: (response) => {
        this.openLoginModal();
        this.otpCode = '';
        this.otpErrorMessage = '';
        console.log('OTP success', response);
      },
      error: (error) => {
        console.error('OTP failed', error);
        this.otpErrorMessage = 'Sai mã xác minh. Vui lòng thử lại.';
      }
    });
  }

  onForgotPassword(): void {
    this.authService.sendForgotPassword(this.emailForgot).subscribe({
      next: (response) => {
        this.openOtpForgotModal();
        console.log('ForgotPassword success', response);
      },
      error: (error) => {
        console.error('ForgotPassword failed', error);
      }
    });
  }

  onOtpForgotSubmit(): void {
    this.authService.sendOTPForm(this.emailForgot, this.otpCode, 'FORGOT_PASSWORD').subscribe({
      next: (response) => {
        this.closeAllModals(); // Có thể điều hướng sang trang nhập mật khẩu mới
        this.otpCode = '';
        this.otpErrorMessage = '';
        console.log('OTP (forgot) success', response);
      },
      error: (error) => {
        console.error('OTP (forgot) failed', error);
        this.otpErrorMessage = 'Sai mã xác minh. Vui lòng thử lại.';
      }
    });
  }

}
