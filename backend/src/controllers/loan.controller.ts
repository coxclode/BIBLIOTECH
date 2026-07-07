import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { BadRequestError } from "../utils/httpError";
import * as loanService from "../services/loan.service";

export const listarPrestamosHandler = asyncHandler(async (_req: Request, res: Response) => {
  const prestamos = await loanService.listarPrestamos();
  res.status(200).json(prestamos);
});

export const obtenerPrestamoHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const prestamo = await loanService.obtenerPrestamo(id);
  res.status(200).json(prestamo);
});

export const crearPrestamoHandler = asyncHandler(async (req: Request, res: Response) => {
  const { libroId, lectorId } = req.body;

  if (!libroId || !lectorId) {
    throw new BadRequestError("El libro y el lector son requeridos");
  }

  const prestamo = await loanService.crearPrestamo({
    libroId: Number(libroId),
    lectorId: Number(lectorId),
  });
  res.status(201).json(prestamo);
});

export const registrarDevolucionHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const prestamo = await loanService.registrarDevolucion(id);
  res.status(200).json(prestamo);
});
