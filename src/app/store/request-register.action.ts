import { RequestRegisterState } from "@app/interfaces/store";
import { createAction } from "@ngrx/store";

export const requestRegister = createAction(
  "[RequestRegister] requestRegister",
  (requestRegister: RequestRegisterState) => ({ ...requestRegister }),
);

export const requestRegisterReset = createAction("[RequestRegister] requestRegisterReset");

