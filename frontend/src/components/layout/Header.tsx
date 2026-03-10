import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/contracts": "Contratos",
  "/contracts/new": "Novo Contrato",
  "/clients": "Clientes",
  "/clients/new": "Novo Cliente",
  "/users": "Usuários",
};

export function Header() {
  const { pathname } = useLocation();

  const title = pageTitles[pathname] ?? "Gestão de Contratos";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
      <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
    </header>
  );
}