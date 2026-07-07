import { FormEvent, useEffect, useState } from "react";
import { Libro, Lector, Prestamo } from "../types";
import { listarLibros } from "../services/books.service";
import { listarLectores } from "../services/readers.service";
import * as loansService from "../services/loans.service";
import { useNotification } from "../context/NotificationContext";
import { extraerMensajeError } from "../services/api";

export function LoansPage() {
  const { notificar } = useNotification();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [lectores, setLectores] = useState<Lector[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [libroId, setLibroId] = useState<string>("");
  const [lectorId, setLectorId] = useState<string>("");
  const [cargando, setCargando] = useState(false);

  async function cargarDatos() {
    try {
      const [librosData, lectoresData, prestamosData] = await Promise.all([
        listarLibros(),
        listarLectores(),
        loansService.listarPrestamos(),
      ]);
      setLibros(librosData);
      setLectores(lectoresData);
      setPrestamos(prestamosData);
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!libroId || !lectorId) return;
    setCargando(true);
    try {
      await loansService.crearPrestamo(Number(libroId), Number(lectorId));
      notificar("success", "Préstamo registrado correctamente");
      setLibroId("");
      setLectorId("");
      await cargarDatos();
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    } finally {
      setCargando(false);
    }
  }

  async function handleDevolucion(id: number) {
    try {
      await loansService.registrarDevolucion(id);
      notificar("success", "Devolución registrada correctamente");
      await cargarDatos();
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    }
  }

  const prestamosActivos = prestamos.filter((p) => p.estado === "ACTIVO");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Gestión de Préstamos</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          required
          value={libroId}
          onChange={(e) => setLibroId(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Seleccionar libro</option>
          {libros.map((libro) => (
            <option key={libro.id} value={libro.id} disabled={libro.cantidadDisponible <= 0}>
              {libro.titulo} ({libro.cantidadDisponible} disponibles)
            </option>
          ))}
        </select>

        <select
          required
          value={lectorId}
          onChange={(e) => setLectorId(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Seleccionar lector</option>
          {lectores.map((lector) => (
            <option key={lector.id} value={lector.id}>
              {lector.nombre} {lector.apellidos} ({lector.dni})
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={cargando}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          Registrar préstamo
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Libro</th>
              <th className="px-4 py-3">Lector</th>
              <th className="px-4 py-3">Fecha préstamo</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prestamosActivos.map((prestamo) => (
              <tr key={prestamo.id}>
                <td className="px-4 py-3">{prestamo.libro.titulo}</td>
                <td className="px-4 py-3">
                  {prestamo.lector.nombre} {prestamo.lector.apellidos}
                </td>
                <td className="px-4 py-3">{new Date(prestamo.fechaPrestamo).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDevolucion(prestamo.id)}
                    className="text-emerald-600 hover:underline"
                  >
                    Registrar devolución
                  </button>
                </td>
              </tr>
            ))}
            {prestamosActivos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No hay préstamos activos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
