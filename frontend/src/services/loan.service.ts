import { api } from "./api";
import { Prestamo } from "../types";

export async function listarPrestamos(): Promise<Prestamo[]> {
  const { data } = await api.get<Prestamo[]>("/prestamos");
  return data;
}

export async function crearPrestamo(libroId: number, lectorId: number): Promise<Prestamo> {
  const { data } = await api.post<Prestamo>("/prestamos", { libroId, lectorId });
  return data;
}

export async function registrarDevolucion(id: number): Promise<Prestamo> {
  const { data } = await api.patch<Prestamo>(`/prestamos/${id}/devolucion`);
  return data;
}
