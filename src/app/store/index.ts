import { environment } from '@environments/environment';
import { ActionReducer, MetaReducer } from '@ngrx/store';

import { localStorageSync } from 'ngrx-store-localstorage';
import CryptoJS from 'crypto-js';

import { sessionReducer } from './session.reducer';
import { requestRegisterReducer } from './request-register.reducer';

export const reducers = {
  session: sessionReducer,
  requestRegister: requestRegisterReducer,
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: [
      {
        session: {
          encrypt: (data) => {
            const encryptedData = CryptoJS.AES.encrypt(
              JSON.stringify(data),
              environment.secret
            ).toString()
            return encryptedData
          },
          decrypt: (data) => {
            const decryptedData = CryptoJS.AES.decrypt(
              data,
              environment.secret
            ).toString(CryptoJS.enc.Utf8)
            return JSON.parse(decryptedData)
          },
        },
      },
      {
        requestRegister: {
          encrypt: (data) => {
            const encryptedData = CryptoJS.AES.encrypt(
              JSON.stringify(data),
              environment.secret
            ).toString()
            return encryptedData
          },
          decrypt: (data) => {
            const decryptedData = CryptoJS.AES.decrypt(
              data,
              environment.secret
            ).toString(CryptoJS.enc.Utf8)
            return JSON.parse(decryptedData)
          }
        }
      }
    ],
    rehydrate: true,
  })(reducer);
}

export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];
