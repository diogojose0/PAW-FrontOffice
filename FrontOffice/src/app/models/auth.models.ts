export interface PublicUser {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
  active: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: PublicUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
