export interface CrearLibroDTO {
  codigo: string;
  titulo: string;
  autor: string;
  categoria: string;
  isbn: string;
  cantidadTotal: number;
}

export interface ActualizarLibroDTO {
  codigo?: string;
  titulo?: string;
  autor?: string;
  categoria?: string;
  isbn?: string;
  cantidadTotal?: number;
}

export interface CrearLectorDTO {
  dni: string;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

export interface ActualizarLectorDTO {
  dni?: string;
  nombre?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
}

export interface CrearPrestamoDTO {
  libroId: number;
  lectorId: number;
}
