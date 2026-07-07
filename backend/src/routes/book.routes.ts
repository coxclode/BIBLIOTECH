import { Router } from "express";
import { Rol } from "@prisma/client";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  actualizarLibroHandler,
  crearLibroHandler,
  eliminarLibroHandler,
  listarLibrosHandler,
  obtenerLibroHandler,
} from "../controllers/book.controller";

const router = Router();

router.use(authenticate);

router.get("/", listarLibrosHandler);
router.get("/:id", obtenerLibroHandler);
router.post("/", authorize(Rol.ADMINISTRADOR, Rol.BIBLIOTECARIO), crearLibroHandler);
router.put("/:id", authorize(Rol.ADMINISTRADOR, Rol.BIBLIOTECARIO), actualizarLibroHandler);
router.delete("/:id", authorize(Rol.ADMINISTRADOR), eliminarLibroHandler);

export default router;
