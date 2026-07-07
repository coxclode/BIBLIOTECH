import { FormEvent, useEffect, useState } from "react";
import { Libro } from "../types";
import * as booksService from "../services/books.service";
import { useNotification } from "../context/NotificationContext";
import { extraerMensajeError } from "../services/api";

const FORM_INICIAL = {
  codigo: "",
  titulo: "",
  autor: "",
  categoria: "",
  isbn: "",
  cantidadTotal: 1,
};

export function BooksPage() {
  const { notificar } = useNotification();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  async function cargarLibros() {
    try {
      const data = await booksService.listarLibros();
      setLibros(data);
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    }
  }

  useEffect(() => {
    cargarLibros();
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
        await booksService.actualizarLibro(editandoId, form);
        notificar("success", "Libro actualizado correctamente");
      } else {
        await booksService.crearLibro(form);
        notificar("success", "Libro creado correctamente");
      }
      limpiarFormulario();
      await cargarLibros();
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    } finally {
      setCargando(false);
    }
  }

  function handleEditar(libro: Libro) {
    setEditandoId(libro.id);
    setForm({
      codigo: libro.codigo,
      titulo: libro.titulo,
      autor: libro.autor,
      categoria: libro.categoria,
      isbn: libro.isbn,
      cantidadTotal: libro.cantidadTotal,
    });
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Eliminar este libro?")) return;
    try {
      await booksService.eliminarLibro(id);
      notificar("success", "Libro eliminado correctamente");
      await cargarLibros();
    } catch (error) {
      notificar("error", extraerMensajeError(error));
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Gestión de Libros</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          required
          placeholder="Código"
          value={form.codigo}
          onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Autor"
          value={form.autor}
          onChange={(e) => setForm({ ...form, autor: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Categoría"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="ISBN"
          value={form.isbn}
          onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="number"
          min={0}
          placeholder="Cantidad total"
          value={form.cantidadTotal}
          onChange={(e) => setForm({ ...form, cantidadTotal: Number(e.target.value) })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <div className="sm:col-span-3 flex gap-2">
          <button
            type="submit"
            disabled={cargando}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            {editandoId !== null ? "Guardar cambios" : "Crear libro"}
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
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Autor</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">ISBN</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Disponibles</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {libros.map((libro) => (
              <tr key={libro.id}>
                <td className="px-4 py-3">{libro.codigo}</td>
                <td className="px-4 py-3">{libro.titulo}</td>
                <td className="px-4 py-3">{libro.autor}</td>
                <td className="px-4 py-3">{libro.categoria}</td>
                <td className="px-4 py-3">{libro.isbn}</td>
                <td className="px-4 py-3">{libro.cantidadTotal}</td>
                <td className="px-4 py-3">{libro.cantidadDisponible}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEditar(libro)} className="text-emerald-600 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(libro.id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {libros.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                  No hay libros registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
