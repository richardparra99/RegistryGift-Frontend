import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, logoutUser, updateUserGroups } from "../redux/slices/authSlice";
import { AuthService } from "../services/AuthService";

type LoginParams = {
  access_token: string;
  refresh_token: string;
  email: string;
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);
  const groups = useAppSelector((state) => state.auth.groups ?? []);

  const doLogin = (params: LoginParams) => {
    dispatch(loginUser(params.email));
  };

  const clearAuth = () => {
    dispatch(logoutUser());
    dispatch(updateUserGroups({ groups: [] }));
  };

  const doLogout = () => {
    new AuthService()
      .logout()
      .then(() => clearAuth())
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
        clearAuth();
      });
  };

  const loadUser = async () => {
    try {
      const user = await new AuthService().me();
      if (user.email) {
        dispatch(loginUser(user.email));
        dispatch(updateUserGroups({ groups: user.groups ?? [] }));
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
      console.log("Usuario no autenticado. Mostrando menú de invitado.");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const isAdmin = groups.includes("Administrador");
  const isComprador = groups.includes("Comprador");

  return {
    email,
    groups,
    isAdmin,
    isComprador,
    doLogin,
    doLogout,
  };
};

