import { environment } from '@environments/environment';
import { ActionReducer, MetaReducer } from '@ngrx/store';

import { localStorageSync } from 'ngrx-store-localstorage';
import CryptoJS from 'crypto-js';

import { sessionReducer } from './session.reducer';
import { Session } from '@app/interfaces/store';

export const reducers = {
  session: sessionReducer,
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
            console.log('decryptedData', decryptedData)
            return JSON.parse(decryptedData)
          },
        }
      }
    ]
  })(reducer);
}

export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];
