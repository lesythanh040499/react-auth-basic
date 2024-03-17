import { User } from "../contexts/auth/type";

export interface AuthDto {
  accessToken: string;
  user: User;
}

export const USER: User = {
  id: "1",
  name: "Thanh",
  role: "SUPER_ADMIN",
} as const;

class AuthService {
  async signIn(): Promise<AuthDto> {
    return Promise.resolve({
      accessToken: "accessToken",
      user: USER,
    });
  }

  async getProfile(): Promise<User> {
    return Promise.resolve(USER);
  }
}

export const authService = new AuthService();
