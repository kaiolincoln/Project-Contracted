import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";
import type { User } from "../types";
import toast from "react-hot-toast";

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("@contract:token");
    const storedUser = localStorage.getItem("@contract:user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }
  }, []);

  async function signIn(email: string, password: string) {
    const response = await api.post("/session", { email, password });
    const { token } = response.data;

    localStorage.setItem("@contract:token", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setToken(token);

    const meResponse = await api.get("/me");
    setUser(meResponse.data);
    localStorage.setItem("@contract:user", JSON.stringify(meResponse.data));

    toast.success("Bem-vindo de volta!");
  }

  function signOut() {
    localStorage.removeItem("@contract:token");
    localStorage.removeItem("@contract:user");
    setUser(null);
    setToken(null);
    toast.success("Até logo!");
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isAdmin: user?.role === "ADMIN",
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}