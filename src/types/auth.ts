export interface User {
  id: number;
  email: string;
  companyName: string;
  inn: string;
  director: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  inn: string;
  companyName: string;
  director: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
