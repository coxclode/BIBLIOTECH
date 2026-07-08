import { api } from "./api";
import { Lector } from "../types";

export interface LectorFormData {
  dni: string;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

export async function listarLectores(): Promise<Lector[]> {
  const { data } = await api.get<Lector[]>("/lectores");
  return data;
}

export async function crearLector(payload: LectorFormData): Promise<Lector> {
  const { data } = await api.post<Lector>("/lectores", payload);
  return data;
}

export async function actualizarLector(id: number, payload: Partial<LectorFormData>): Promise<Lector> {
  const { data } = await api.put<Lector>(`/lectores/${id}`, payload);
  return data;
}

export async function eliminarLector(id: number): Promise<void> {
  await api.delete(`/lectores/${id}`);
}
