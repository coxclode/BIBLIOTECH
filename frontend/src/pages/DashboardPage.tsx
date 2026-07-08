import { useEffect, useState } from "react";
import { listarLibros } from "../services/book.service";
import { listarLectores } from "../services/reader.service";
import { listarPrestamos } from "../services/loan.service";
import { useNotification } from "../context/NotificationContext";
import { extraerMensajeError } from "../services/api";

interface Resumen {
  totalLibros: number;
  totalLectores: number;
  prestamosActivos: number;
  ejemplaresDisponibles: number;
}

export function DashboardPage() {
  const { notificar } = useNotification();
  const [resumen, setResumen] = useState<Resumen | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const [libros, lectores, prestamos] = await Promise.all([
          listarLibros(),
          listarLectores(),
          listarPrestamos(),
        ]);
        setResumen({
          totalLibros: libros.length,
          totalLectores: lectores.length,
          prestamosActivos: prestamos.filter((p) => p.estado === "ACTIVO").length,
          ejemplaresDisponibles: libros.reduce((acc, l) => acc + l.cantidadDisponible, 0),
        });
      } catch (error) {
        notificar("error", extraerMensajeError(error));
      }
    }
    cargar();
  }, [notificar]);

  const tarjetas = [
    { label: "Libros registrados", valor: resumen?.totalLibros },
    { label: "Lectores registrados", valor: resumen?.totalLectores },
    { label: "Préstamos activos", valor: resumen?.prestamosActivos },
    { label: "Ejemplares disponibles", valor: resumen?.ejemplaresDisponibles },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map((tarjeta) => (
          <div key={tarjeta.label} className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-slate-500">{tarjeta.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{tarjeta.valor ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
