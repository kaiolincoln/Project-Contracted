import { AuthProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./routes";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}