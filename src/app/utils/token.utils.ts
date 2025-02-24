import { jwtDecode } from 'jwt-decode';
import { UserData } from '@interfaces/store';

// Decodifica un token
export function decoderToken(token: string): UserData {
  return jwtDecode<UserData>(token);
}

// Verifica expiración de token
export function hasExpiredToken(token: string) {
  const { exp } = decoderToken(token);

  const currentData = new Date().getTime();
  const expirationDate = new Date(exp * 1000).getTime();

  return currentData > expirationDate;
}
