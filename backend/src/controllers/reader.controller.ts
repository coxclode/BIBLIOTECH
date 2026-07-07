import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { BadRequestError } from "../utils/httpError";
import * as readerService from "../services/reader.service";

export const listarLectoresHandler = asyncHandler(async (_req: Request, res: Response) => {
  const lectores = await readerService.listarLectores();
  res.status(200).json(lectores);
});

export const obtenerLectorHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const lector = await readerService.obtenerLector(id);
  res.status(200).json(lector);
});

export const crearLectorHandler = asyncHandler(async (req: Request, res: Response) => {
  const { dni, nombre, apellidos, correo, telefono } = req.body;

  if (!dni || !nombre || !apellidos || !correo || !telefono) {
    throw new BadRequestError("Todos los campos del lector son requeridos");
  }

  const lector = await readerService.crearLector({ dni, nombre, apellidos, correo, telefono });
  res.status(201).json(lector);
});

export const actualizarLectorHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { dni, nombre, apellidos, correo, telefono } = req.body;

  const lector = await readerService.actualizarLector(id, {
    dni,
    nombre,
    apellidos,
    correo,
    telefono,
  });
  res.status(200).json(lector);
});

export const eliminarLectorHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await readerService.eliminarLector(id);
  res.status(204).send();
});
