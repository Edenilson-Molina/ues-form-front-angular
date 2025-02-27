export interface UserData {
  email: string;
  userId: string;
  candidateId: string;
  recruiterId: string;
  personId: string;
  permissions: string[];
  roles: string[];
  iat: number;
  exp: number;
}

export interface Session {
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  darkMode: boolean;
  showMenu: boolean;
  // person: Person | null;
  // company: Company | null;
}
