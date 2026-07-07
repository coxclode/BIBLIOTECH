import { FormEvent, useEffect, useState } from "react";
import { Lector } from "../types";
import * as readersService from "../services/readers.service";
import { useNotification } from "../context/NotificationContext";
import { extraerMensajeError } from "../services/api";

const FORM_INICIAL = {
  dni: "",
  nombre: "",
  apellidos: "",
  correo: "",
  telefono: "",
};

export function ReadersPage() {
  const { notificar } = useNotification();
  const [lectores, setLectores] = useState<Lector[]>([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  async function cargarLectores() {
    try {
      const data = await readersService.listarLectores();
      setLectores(data);
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    }
  }

  useEffect(() => {
    cargarLectores();
  }, []);

  function limpiarFormulario() {
    setForm(FORM_INICIAL);
    setEditandoId(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setCargando(true);
    try {
      if (editandoId !== null) {
        await readersService.actualizarLector(editandoId, form);
        notificar("success", "Lector actualizado correctamente");
      } else {
        await readersService.crearLector(form);
        notificar("success", "Lector creado correctamente");
      }
      limpiarFormulario();
      await cargarLectores();
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    } finally {
      setCargando(false);
    }
  }

  function handleEditar(lector: Lector) {
    setEditandoId(lector.id);
    setForm({
      dni: lector.dni,
      nombre: lector.nombre,
      apellidos: lector.apellidos,
      correo: lector.correo,
      telefono: lector.telefono,
    });
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Eliminar este lector?")) return;
    try {
      await readersService.eliminarLector(id);
      notificar("success", "Lector eliminado correctamente");
      await cargarLectores();
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Gestión de Lectores</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          required
          placeholder="DNI"
          value={form.dni}
          onChange={(e) => setForm({ ...form, dni: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="email"
          placeholder="Correo"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <div className="sm:col-span-3 flex gap-2">
          <button
            type="submit"
            disabled={cargando}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            {editandoId !== null ? "Guardar cambios" : "Crear lector"}
          </button>
          {editandoId !== null && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">DNI</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Apellidos</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lectores.map((lector) => (
              <tr key={lector.id}>
                <td className="px-4 py-3">{lector.dni}</td>
                <td className="px-4 py-3">{lector.nombre}</td>
                <td className="px-4 py-3">{lector.apellidos}</td>
                <td className="px-4 py-3">{lector.correo}</td>
                <td className="px-4 py-3">{lector.telefono}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEditar(lector)} className="text-emerald-600 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(lector.id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {lectores.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No hay lectores registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
