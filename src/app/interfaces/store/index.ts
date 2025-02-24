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
  token: string | null;
  isLoading: boolean;
  showMenu: boolean;
  // person: Person | null;
  // company: Company | null;
}
