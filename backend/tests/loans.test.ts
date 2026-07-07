import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { crearUsuarioDePrueba, limpiarBaseDeDatos } from "./helpers";

const app = createApp();

describe("Préstamos y devoluciones", () => {
  let token: string;
  let libroId: number;
  let lectorId: number;

  beforeAll(async () => {
    await limpiarBaseDeDatos();
    const usuario = await crearUsuarioDePrueba("loans-test@biblioteca.com");
    token = usuario.token;

    const libro = await prisma.libro.create({
      data: {
        codigo: "LOAN-001",
        titulo: "Libro de Prueba",
        autor: "Autor de Prueba",
        categoria: "Prueba",
        isbn: "978-0-00-000001-1",
        cantidadTotal: 1,
        cantidadDisponible: 1,
      },
    });
    libroId = libro.id;

    const lector = await prisma.lector.create({
      data: {
        dni: "10000001",
        nombre: "Lector",
        apellidos: "De Prueba",
        correo: "lector-test@example.com",
        telefono: "900000000",
      },
    });
    lectorId = lector.id;
  });

  afterAll(async () => {
    await limpiarBaseDeDatos();
    await prisma.$disconnect();
  });

  it("debe registrar un préstamo y descontar la disponibilidad del libro", async () => {
    const res = await request(app)
      .post("/api/prestamos")
      .set("Authorization", `Bearer ${token}`)
      .send({ libroId, lectorId });

    expect(res.status).toBe(201);
    expect(res.body.estado).toBe("ACTIVO");
    expect(res.body.libro.cantidadDisponible).toBe(0);
  });

  it("no debe permitir un préstamo si no hay disponibilidad", async () => {
    const res = await request(app)
      .post("/api/prestamos")
      .set("Authorization", `Bearer ${token}`)
      .send({ libroId, lectorId });

    expect(res.status).toBe(409);

    const libro = await prisma.libro.findUnique({ where: { id: libroId } });
    expect(libro?.cantidadDisponible).toBe(0);
  });

  it("no debe permitir un préstamo para un lector inexistente", async () => {
    const res = await request(app)
      .post("/api/prestamos")
      .set("Authorization", `Bearer ${token}`)
      .send({ libroId, lectorId: 999999 });

    expect(res.status).toBe(404);
  });

  it("debe registrar la devolución y restaurar la disponibilidad del libro", async () => {
    const prestamoActivo = await prisma.prestamo.findFirstOrThrow({
      where: { libroId, lectorId, estado: "ACTIVO" },
    });

    const res = await request(app)
      .patch(`/api/prestamos/${prestamoActivo.id}/devolucion`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe("DEVUELTO");
    expect(res.body.fechaDevolucion).not.toBeNull();
    expect(res.body.libro.cantidadDisponible).toBe(1);
  });

  it("no debe permitir devolver un préstamo ya devuelto", async () => {
    const prestamoDevuelto = await prisma.prestamo.findFirstOrThrow({
      where: { libroId, lectorId, estado: "DEVUELTO" },
    });

    const res = await request(app)
      .patch(`/api/prestamos/${prestamoDevuelto.id}/devolucion`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(409);
  });
});
