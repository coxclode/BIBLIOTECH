export type Rol = "ADMINISTRADOR" | "BIBLIOTECARIO";
export type EstadoPrestamo = "ACTIVO" | "DEVUELTO";

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
}

export interface Libro {
  id: number;
  codigo: string;
  titulo: string;
  autor: string;
  categoria: string;
  isbn: string;
  cantidadTotal: number;
  cantidadDisponible: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lector {
  id: number;
  dni: string;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prestamo {
  id: number;
  libroId: number;
  lectorId: number;
  fechaPrestamo: string;
  fechaDevolucion: string | null;
  estado: EstadoPrestamo;
  libro: Libro;
  lector: Lector;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
