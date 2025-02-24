import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { sessionReducer } from './session.reducer';
import { Session } from '@app/interfaces/store';

export const reducers = {
  session: sessionReducer,
};

export const metaReducers: MetaReducer<any>[] = !isDevMode() ? [] : [];
