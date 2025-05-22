import { createAction } from '@ngrx/store';

export const login = createAction('[Session] login', (accessToken: string, isUnlocked: boolean = true) => ({ accessToken, isUnlocked }));
export const logout = createAction('[Session] logout');
export const showMenu = createAction('[Session] showMenu', (showMenu: boolean) => ({ showMenu }));
export const toggleDarkMode = createAction('[Session] toggleDarkMode');
export const isLoading = createAction('[Session] isLoading', (isLoading: boolean) => ({ isLoading }));
export const resetState = createAction('[Session] resetState');
