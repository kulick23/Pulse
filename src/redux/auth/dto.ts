// DTO для пользователя
export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// DTO для ответа с токенами и пользователем
export interface AuthResponseDto {
  user?: UserDto;
  access_token: string;
  refresh_token: string;
}

// DTO для ответа только с токенами
export interface TokenResponseDto {
  access_token: string;
  refresh_token: string;
}

// DTO для запроса входа
export interface LoginDto {
  email: string;
  password: string;
}

// DTO для запроса кода регистрации
export interface GetRegistrationCodeDto {
  email: string;
}

// DTO для запроса регистрации
export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  code?: string;
  inn: string;
  name_company: string;
  leader_name: string;
}

// DTO для запроса кода восстановления пароля
export interface GetRecoveryCodeDto {
  email: string;
}

// DTO для обновления пароля
export interface UpdatePasswordDto {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}
