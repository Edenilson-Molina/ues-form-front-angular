import { createReducer, on } from '@ngrx/store';
import { Session } from '@interfaces/store';
import { decoderToken } from '@utils/token.utils';
import { isLoading, login, logout, resetState, showMenu, toggleDarkMode } from './auth.actions';
import { LOCAL_STORAGE } from '@utils/constants.utils';

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

  // const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  // const showMenu = Boolean(localStorage.getItem(LOCAL_STORAGE.SHOW_MENU))
  // const darkMode = Boolean(localStorage.getItem(LOCAL_STORAGE.DARK_MODE));
  // const isLoading = Boolean(localStorage.getItem(LOCAL_STORAGE.IS_LOADING));
  // if (token) {
  //   const userInfo = decoderToken(token);
  //   initState.token = token;
  //   initState.user = userInfo;
  // }
  // if (showMenu) {
  //   initState.showMenu = showMenu;
  // }
  // if (darkMode) {
  //   initState.darkMode = darkMode;
  // }
  // if (isLoading) {
  //   initState.isLoading = isLoading;
  // }
  return initState;
}

export const sessionReducer = createReducer(
  initialState,
  on(login, (state, { accessToken, refreshToken }) => {
    // localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
    // localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, refreshToken);
    const userInfo = decoderToken(accessToken!);
    return {
      ...state,
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userInfo,
    };
  }),
  on(logout, (state) => {
    // localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
    // localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
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
    // localStorage.setItem(LOCAL_STORAGE.IS_LOADING, isLoading.toString());
    return {
      ...state,
      isLoading: isLoading,
    };
  }),

  on(showMenu, (state, { showMenu }) => {
    // localStorage.setItem(LOCAL_STORAGE.SHOW_MENU, showMenu.toString());
    return {
      ...state,
      showMenu: showMenu,
    };
  }),

  on(toggleDarkMode, (state) => {
    // localStorage.setItem(LOCAL_STORAGE.DARK_MODE, darkMode.toString());
    const root = document.documentElement;
    root.classList.toggle('dark-mode', !state.darkMode);
    root.classList.toggle('dark', !state.darkMode);
    return {
      ...state,
      darkMode: !state.darkMode,
    };
  }),
  // on(setPerson, (state, { person }) => {
  //   return {
  //     ...state,
  //     person: person,
  //   };
  // }),
  // on(resetState, () => {
  //   return initStore();
  // }),
  // on(setCompany, (state, { company }) => {
  //   return {
  //     ...state,
  //     company: company,
  //   };
  // }),
);
