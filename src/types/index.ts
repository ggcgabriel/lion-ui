export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  position: string;
  active?: boolean;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  position?: string;
  active?: boolean;
}

export interface ApiError {
  message: string | string[];
  error?: string;
  statusCode: number;
}
