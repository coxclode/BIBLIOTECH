import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { Usuario } from "../types";
import * as authService from "../services/auth.service";

interface AuthContextValue {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function leerUsuarioAlmacenado(): Usuario | null {
  const raw = localStorage.getItem("usuario");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioAlmacenado);

  const login = async (correo: string, password: string) => {
    const response = await authService.login(correo, password);
    localStorage.setItem("token", response.token);
    localStorage.setItem("usuario", JSON.stringify(response.usuario));
    setUsuario(response.usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ usuario, isAuthenticated: usuario !== null, login, logout }),
    [usuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
