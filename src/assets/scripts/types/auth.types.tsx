export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  };
  error: boolean;
  message: string[];
}

export interface LoginRequest {
  userName: string;
  password: string;
}
