import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { clientService } from "../../services/clientService";
import type { Client } from "../../types";

export function ClientList() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await clientService.list();
        setClients(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(clients);
      return;
    }
    setFiltered(clients.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.document.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, clients]);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      await clientService.remove(id);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao excluir cliente");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Topo */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{filtered.length} cliente(s) encontrado(s)</p>
        <button
          onClick={() => navigate("/clients/new")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Cliente
        </button>
      </div>

      {/* Busca */}
      <input
        type="text"
        placeholder="Buscar por nome, CPF/CNPJ ou email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Nenhum cliente encontrado
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">CPF/CNPJ</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Telefone</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-800">{client.name}</td>
                  <td className="px-6 py-4 text-slate-600">{client.document}</td>
                  <td className="px-6 py-4 text-slate-600">{client.email ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{client.phone ?? "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/clients/${client.id}/edit`)}
                        className="text-slate-600 hover:text-slate-800 text-xs font-medium cursor-pointer"
                      >
                        Editar
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}