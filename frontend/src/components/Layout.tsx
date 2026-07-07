import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/libros", label: "Libros" },
  { to: "/lectores", label: "Lectores" },
  { to: "/prestamos", label: "Préstamos" },
  { to: "/historial", label: "Historial" },
];

export function Layout() {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">BIBLIOTECH</h1>
          <nav className="flex gap-4 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `hover:text-emerald-400 ${isActive ? "text-emerald-400 font-semibold" : "text-slate-200"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300">
              {usuario?.nombre} <span className="text-slate-500">({usuario?.rol})</span>
            </span>
            <button
              onClick={logout}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
