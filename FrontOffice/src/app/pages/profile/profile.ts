import { Component, OnInit } from '@angular/core';

import { PublicUser, UpdatePasswordRequest, UpdateProfileRequest } from '../../models/auth.models';
import { AuthRestServiceService } from '../../services/auth-rest-service.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  user: PublicUser | null = null;

  profileData: UpdateProfileRequest = {
    name: '',
    email: '',
    address: '',
    phone: '',
  };

  passwordData: UpdatePasswordRequest = {
    currentPassword: '',
    newPassword: '',
  };

  loadingProfile = false;
  savingProfile = false;
  savingPassword = false;

  profileSuccessMessage = '';
  profileErrorMessage = '';

  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  constructor(private authService: AuthRestServiceService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loadingProfile = true;
    this.profileErrorMessage = '';

    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user = response.user;

        this.profileData = {
          name: response.user.name,
          email: response.user.email,
          address: response.user.address,
          phone: response.user.phone,
        };

        this.loadingProfile = false;
      },
      error: (error) => {
        this.profileErrorMessage = error.error?.message || 'Could not load profile.';
        this.loadingProfile = false;
      },
    });
  }

  updateProfile(): void {
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';

    if (
      !this.profileData.name ||
      !this.profileData.email ||
      !this.profileData.address ||
      !this.profileData.phone
    ) {
      this.profileErrorMessage = 'All profile fields are required.';
      return;
    }

    this.savingProfile = true;

    this.authService.updateProfile(this.profileData).subscribe({
      next: (response) => {
        this.user = response.user;

        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          currentUser.user = response.user;
          this.authService.saveCurrentUser(currentUser);
        }

        this.profileSuccessMessage = response.message;
        this.savingProfile = false;
      },
      error: (error) => {
        this.profileErrorMessage = error.error?.message || 'Could not update profile.';
        this.savingProfile = false;
      },
    });
  }

  updatePassword(): void {
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    if (!this.passwordData.currentPassword || !this.passwordData.newPassword) {
      this.passwordErrorMessage = 'Current password and new password are required.';
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.passwordErrorMessage = 'New password must have at least 6 characters.';
      return;
    }

    this.savingPassword = true;

    this.authService.updatePassword(this.passwordData).subscribe({
      next: (response) => {
        this.passwordSuccessMessage = response.message;

        this.passwordData = {
          currentPassword: '',
          newPassword: '',
        };

        this.savingPassword = false;
      },
      error: (error) => {
        this.passwordErrorMessage = error.error?.message || 'Could not update password.';
        this.savingPassword = false;
      },
    });
  }
}
