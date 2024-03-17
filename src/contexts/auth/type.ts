export interface User {
  id: string;
  name: string;
  role: string;
}

export interface AuthState {
  isAuthenticated?: boolean;
  isInitialzed?: boolean;
  user: User | null;
}
