import { createReducer, on } from "@ngrx/store";
import { RequestRegisterState } from "@app/interfaces/store";
import { requestRegister, requestRegisterReset } from "./request-register.action";

export const initialState: RequestRegisterState = initStore();

function initStore() {
  const initState: RequestRegisterState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    identificacion: "",
    justificacion_solicitud: "",
  };
  return initState;
}

export const requestRegisterReducer = createReducer(
  initialState,
  on(requestRegister, (state, newState) => {
    return {
      ...state,
      ...newState
    };
  }),
  on(requestRegisterReset,(state) =>{
    return {
      ...state,
      ...initStore()
    };
  })
);


