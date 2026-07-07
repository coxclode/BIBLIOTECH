import { api } from "./api";
import { LoginResponse } from "../types";

export async function login(correo: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { correo, password });
  return data;
}
