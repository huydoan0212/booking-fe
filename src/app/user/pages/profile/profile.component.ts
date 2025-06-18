import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../service/profile/api/profile.service';
import { UserProfile } from '../../../../service/profile/model/user-profile.model';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    NgIf
  ]
})
export class ProfileComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  profileData!: UserProfile;
  originalProfileData!: UserProfile;
  gender: number = 0;
  isEditing: boolean = false;

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profileData = data.responseData;
        this.gender = this.profileData.gender;
        console.log('Profile data:', this.profileData);
      },
      error: (err) => {
        console.error('Lỗi khi lấy profile:', err);
      }
    });
  }

  saveProfile() {
    if (!this.profileData.username || !this.profileData.name || !this.profileData.dob) {
      console.error('Dữ liệu không hợp lệ.');
      return;
    }

    const updatedProfile = {
      username: this.profileData.username,
      name: this.profileData.name,
      dob: this.formatDate(this.profileData.dob),
      idNumber: this.profileData.idNumber ?? '',
      gender: this.gender
    };

    this.profileService.updateProfile(updatedProfile).subscribe({
      next: (res) => {
        console.log('Cập nhật thành công:', res);
        this.showSuccessModal = true;
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
      }
    });
  }
  private formatDate(date: string | Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }
  showSuccessModal: boolean = false;
  onToggleEdit() {
    if (!this.isEditing) {
      this.originalProfileData = JSON.parse(JSON.stringify(this.profileData));
    } else {
      this.profileData = JSON.parse(JSON.stringify(this.originalProfileData));
      this.gender = this.profileData.gender;
    }
    this.isEditing = !this.isEditing;
  }



}
