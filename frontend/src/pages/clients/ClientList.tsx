import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { clientService } from "../../services/clientService";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { Pagination } from "../../components/ui/Pagination";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useConfirm } from "../../hooks/useConfirm";
import { usePagination } from "../../hooks/usePagination";
import type { Client } from "../../types";
import toast from "react-hot-toast";

export function ClientList() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { isOpen, loading: confirmLoading, options, confirm, handleConfirm, handleCancel } = useConfirm();

  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { paginated, currentPage, totalPages, setCurrentPage, reset } = usePagination(filtered);

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
    } else {
      setFiltered(clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.document.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      ));
    }
    reset();
  }, [search, clients]);

  function handleDelete(id: string) {
    confirm(
      {
        title: "Excluir Cliente",
        message: "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.",
        confirmLabel: "Sim, excluir",
        variant: "danger",
      },
      async () => {
        await clientService.remove(id);
        setClients(prev => prev.filter(c => c.id !== id));
        toast.success("Cliente excluído com sucesso!");
      }
    );
  }

  if (loading) return <TableSkeleton rows={5} cols={5} />;

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
              {paginated.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-800">{client.name}</td>
                  <td className="px-6 py-4 text-slate-600">{client.document}</td>
                  <td className="px-6 py-4 text-slate-600">{client.email ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{client.phone ?? "—"}</td>
                  <td className="px-6 py-4">
  <div className="flex items-center gap-2">
    <button
      onClick={() => navigate(`/clients/${client.id}/edit`)}
      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
      title="Editar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>

    {isAdmin && (
      <button
        onClick={() => handleDelete(client.id)}
        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
        title="Excluir"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
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

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      <ConfirmModal
        isOpen={isOpen}
        loading={confirmLoading}
        title={options.title}
        message={options.message}
        confirmLabel={options.confirmLabel}
        variant={options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

    </div>
  );
}