import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContractDetail } from "../pages/contracts/ContractDetail";
import { ContractList } from "../pages/contracts/ContractList";
import { ContractForm } from "../pages/contracts/ContractForm";
import { ClientForm } from "../pages/clients/ClientForm";
import { ClientList } from "../pages/clients/ClientList";
import { Layout } from "../components/layout/Layout";
import { UserForm } from "../pages/users/UserForm";
import { UserList } from "../pages/users/UserList";
import { useAuth } from "../contexts/AuthContext";
import { Dashboard } from "../pages/Dashboard";
import { PrivateRoute } from "./PrivateRoute";
import { NotFound } from "../pages/NotFound";
import { Profile } from "../pages/Profile";
import { Login } from "../pages/Login";

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
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id/edit" element={<UserForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}