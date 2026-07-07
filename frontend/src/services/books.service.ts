import { api } from "./api";
import { Libro } from "../types";

export interface LibroFormData {
  codigo: string;
  titulo: string;
  autor: string;
  categoria: string;
  isbn: string;
  cantidadTotal: number;
}

export async function listarLibros(): Promise<Libro[]> {
  const { data } = await api.get<Libro[]>("/libros");
  return data;
}

export async function crearLibro(payload: LibroFormData): Promise<Libro> {
  const { data } = await api.post<Libro>("/libros", payload);
  return data;
}

export async function actualizarLibro(id: number, payload: Partial<LibroFormData>): Promise<Libro> {
  const { data } = await api.put<Libro>(`/libros/${id}`, payload);
  return data;
}

export async function eliminarLibro(id: number): Promise<void> {
  await api.delete(`/libros/${id}`);
}
