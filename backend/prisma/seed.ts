import { PrismaClient, Rol } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const bibliotecarioPasswordHash = await bcrypt.hash("bibliotecario123", 10);

  await prisma.usuario.upsert({
    where: { correo: "admin@biblioteca.com" },
    update: {},
    create: {
      nombre: "Administrador",
      correo: "admin@biblioteca.com",
      password: adminPasswordHash,
      rol: Rol.ADMINISTRADOR,
    },
  });

  await prisma.usuario.upsert({
    where: { correo: "bibliotecario@biblioteca.com" },
    update: {},
    create: {
      nombre: "Bibliotecario",
      correo: "bibliotecario@biblioteca.com",
      password: bibliotecarioPasswordHash,
      rol: Rol.BIBLIOTECARIO,
    },
  });

  const libro = await prisma.libro.upsert({
    where: { isbn: "978-3-16-148410-0" },
    update: {},
    create: {
      codigo: "LIB-001",
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      categoria: "Novela",
      isbn: "978-3-16-148410-0",
      cantidadTotal: 5,
      cantidadDisponible: 5,
    },
  });

  await prisma.lector.upsert({
    where: { dni: "00000001" },
    update: {},
    create: {
      dni: "00000001",
      nombre: "Juan",
      apellidos: "Pérez López",
      correo: "juan.perez@example.com",
      telefono: "999999999",
    },
  });

  console.log("Seed ejecutado correctamente.");
  console.log(`Libro de ejemplo creado: ${libro.titulo}`);
}

main()
  .catch((error) => {
    console.error("Error ejecutando el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
