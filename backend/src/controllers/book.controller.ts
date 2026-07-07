import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { BadRequestError } from "../utils/httpError";
import * as bookService from "../services/book.service";

export const listarLibrosHandler = asyncHandler(async (_req: Request, res: Response) => {
  const libros = await bookService.listarLibros();
  res.status(200).json(libros);
});

export const obtenerLibroHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const libro = await bookService.obtenerLibro(id);
  res.status(200).json(libro);
});

export const crearLibroHandler = asyncHandler(async (req: Request, res: Response) => {
  const { codigo, titulo, autor, categoria, isbn, cantidadTotal } = req.body;

  if (!codigo || !titulo || !autor || !categoria || !isbn || cantidadTotal === undefined) {
    throw new BadRequestError("Todos los campos del libro son requeridos");
  }

  const libro = await bookService.crearLibro({
    codigo,
    titulo,
    autor,
    categoria,
    isbn,
    cantidadTotal: Number(cantidadTotal),
  });
  res.status(201).json(libro);
});

export const actualizarLibroHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { codigo, titulo, autor, categoria, isbn, cantidadTotal } = req.body;

  const libro = await bookService.actualizarLibro(id, {
    codigo,
    titulo,
    autor,
    categoria,
    isbn,
    cantidadTotal: cantidadTotal !== undefined ? Number(cantidadTotal) : undefined,
  });
  res.status(200).json(libro);
});

export const eliminarLibroHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await bookService.eliminarLibro(id);
  res.status(204).send();
});
