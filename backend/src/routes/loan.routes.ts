import { Router } from "express";
import { Rol } from "@prisma/client";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  crearPrestamoHandler,
  listarPrestamosHandler,
  obtenerPrestamoHandler,
  registrarDevolucionHandler,
} from "../controllers/loan.controller";

const router = Router();

router.use(authenticate);

router.get("/", listarPrestamosHandler);
router.get("/:id", obtenerPrestamoHandler);
router.post("/", authorize(Rol.ADMINISTRADOR, Rol.BIBLIOTECARIO), crearPrestamoHandler);
router.patch(
  "/:id/devolucion",
  authorize(Rol.ADMINISTRADOR, Rol.BIBLIOTECARIO),
  registrarDevolucionHandler
);

export default router;
