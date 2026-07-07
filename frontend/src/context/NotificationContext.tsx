import { createContext, useCallback, useContext, useState, ReactNode } from "react";

type TipoNotificacion = "success" | "error";

interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
}

interface NotificationContextValue {
  notificar: (tipo: TipoNotificacion, mensaje: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const notificar = useCallback((tipo: TipoNotificacion, mensaje: string) => {
    const id = Date.now() + Math.random();
    setNotificaciones((prev) => [...prev, { id, tipo, mensaje }]);
    setTimeout(() => {
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notificar }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notificaciones.map((n) => (
          <div
            key={n.id}
            className={`rounded-md px-4 py-3 shadow-lg text-sm font-medium text-white ${
              n.tipo === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {n.mensaje}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification debe usarse dentro de un NotificationProvider");
  }
  return context;
}
