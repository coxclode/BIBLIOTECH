import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/Layout";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { BooksPage } from "../pages/BooksPage";
import { ReadersPage } from "../pages/ReadersPage";
import { LoansPage } from "../pages/LoansPage";
import { HistoryPage } from "../pages/HistoryPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/libros" element={<BooksPage />} />
          <Route path="/lectores" element={<ReadersPage />} />
          <Route path="/prestamos" element={<LoansPage />} />
          <Route path="/historial" element={<HistoryPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
