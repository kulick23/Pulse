import { UserDto } from './dto';

export interface AuthState {
  user: UserDto | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ServerError {
  data?: {
    message?: string;
  };
  status?: number;
}
