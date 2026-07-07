import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/prisma";
import { crearUsuarioDePrueba, limpiarBaseDeDatos } from "./helpers";

const app = createApp();

describe("Gestión de libros", () => {
  let token: string;

  beforeAll(async () => {
    await limpiarBaseDeDatos();
    const usuario = await crearUsuarioDePrueba("books-test@biblioteca.com");
    token = usuario.token;
  });

  afterAll(async () => {
    await limpiarBaseDeDatos();
    await prisma.$disconnect();
  });

  it("debe crear un libro correctamente", async () => {
    const res = await request(app)
      .post("/api/libros")
      .set("Authorization", `Bearer ${token}`)
      .send({
        codigo: "TEST-001",
        titulo: "El Quijote",
        autor: "Miguel de Cervantes",
        categoria: "Clásico",
        isbn: "978-0-00-000000-1",
        cantidadTotal: 3,
      });

    expect(res.status).toBe(201);
    expect(res.body.codigo).toBe("TEST-001");
    expect(res.body.cantidadTotal).toBe(3);
    expect(res.body.cantidadDisponible).toBe(3);
  });

  it("no debe crear un libro sin autenticación", async () => {
    const res = await request(app).post("/api/libros").send({
      codigo: "TEST-002",
      titulo: "Sin Auth",
      autor: "Nadie",
      categoria: "Otro",
      isbn: "978-0-00-000000-2",
      cantidadTotal: 1,
    });

    expect(res.status).toBe(401);
  });

  it("no debe crear un libro con campos faltantes", async () => {
    const res = await request(app)
      .post("/api/libros")
      .set("Authorization", `Bearer ${token}`)
      .send({ titulo: "Incompleto" });

    expect(res.status).toBe(400);
  });
});
