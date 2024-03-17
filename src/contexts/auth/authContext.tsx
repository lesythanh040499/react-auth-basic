/* eslint-disable react-refresh/only-export-components */
import {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react";
import { authService } from "../../services/authService";
import { initialize, reducer } from "./reducers";
import { AuthState } from "./type";

export enum AuthActionType {
  INITIALIZE = "INITIALIZE",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
}

export interface PayloadAction<T> {
  type: AuthActionType;
  payload: T;
}

export interface AuthContextType extends AuthState {
  dispatch: Dispatch<PayloadAction<AuthState>>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialzed: false,
  user: null,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  dispatch: () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
      if (!accessToken) {
        return dispatch(initialize({ isAuthenticated: false, user: null }));
      }

      try {
        const user = await authService.getProfile();
        dispatch(initialize({ isAuthenticated: true, user }));
      } catch (error) {
        dispatch(initialize({ isAuthenticated: false, user: null }));
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
