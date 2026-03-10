import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { PrivateRoute } from "./PrivateRoute";
import { Layout } from "../components/layout/Layout";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { ContractList } from "../pages/contracts/ContractList";
import { ContractDetail } from "../pages/contracts/ContractDetail";
import { ContractForm } from "../pages/contracts/ContractForm";
import { ClientList } from "../pages/clients/ClientList";
import { ClientForm } from "../pages/clients/ClientForm";
import { UserList } from "../pages/users/UserList";

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="contracts" element={<ContractList />} />
          <Route path="contracts/new" element={<ContractForm />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="contracts/:id/edit" element={<ContractForm />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/:id/edit" element={<ClientForm />} />
          <Route path="users" element={<UserList />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}