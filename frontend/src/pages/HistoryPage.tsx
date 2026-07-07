import { useEffect, useState } from "react";
import { Prestamo } from "../types";
import { listarPrestamos } from "../services/loans.service";
import { useNotification } from "../context/NotificationContext";
import { extraerMensajeError } from "../services/api";

export function HistoryPage() {
  const { notificar } = useNotification();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await listarPrestamos();
        setPrestamos(data);
      } catch (error) {
        notificar("error", extraerMensajeError(error));
      }
    }
    cargar();
  }, [notificar]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Historial de Préstamos</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Libro</th>
              <th className="px-4 py-3">Lector</th>
              <th className="px-4 py-3">Fecha préstamo</th>
              <th className="px-4 py-3">Fecha devolución</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prestamos.map((prestamo) => (
              <tr key={prestamo.id}>
                <td className="px-4 py-3">{prestamo.libro.titulo}</td>
                <td className="px-4 py-3">
                  {prestamo.lector.nombre} {prestamo.lector.apellidos}
                </td>
                <td className="px-4 py-3">{new Date(prestamo.fechaPrestamo).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {prestamo.fechaDevolucion ? new Date(prestamo.fechaDevolucion).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      prestamo.estado === "ACTIVO"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {prestamo.estado}
                  </span>
                </td>
              </tr>
            ))}
            {prestamos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No hay préstamos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
