import { createReducer, on } from '@ngrx/store';
import { Session } from '@interfaces/store';
import { decoderToken } from '@utils/token.utils';
import { isLoading, login, logout, resetState, showMenu, toggleDarkMode } from './auth.actions';

export const initialState: Session = initStore();

function initStore() {
  const initState: Session = {
    accessToken: '',
    refreshToken: '',
    user: null,
    isLoading: false,
    showMenu: false,
    darkMode: false,
  };
  return initState;
}

export const sessionReducer = createReducer(
  initialState,
  on(login, (state, { accessToken, refreshToken }) => {
    const userInfo = decoderToken(accessToken!);
    return {
      ...state,
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userInfo,
    };
  }),

  on(logout, (state) => {
    return {
      ...state,
      accessToken: '',
      refreshToken: '',
      user: null,
    };
  }),

  on(resetState, () => {
    const initialState = initStore();
    return {
      ...initialState,
      showMenu: false,
    }
  }),

  on(isLoading, (state, { isLoading }) => {
    return {
      ...state,
      isLoading: isLoading,
    };
  }),

  on(showMenu, (state, { showMenu }) => {
    return {
      ...state,
      showMenu: showMenu,
    };
  }),

  on(toggleDarkMode, (state) => {
    const root = document.documentElement;
    root.classList.toggle('dark-mode', !state.darkMode);
    root.classList.toggle('dark', !state.darkMode);
    return {
      ...state,
      darkMode: !state.darkMode,
    };
  })
);
