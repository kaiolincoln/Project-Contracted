import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { contractService } from "../../services/contractService";
import type { Contract } from "../../types";

const statusLabel: Record<string, string> = {
  ACTIVE: "Ativo",
  EXPIRED: "Vencido",
  CANCELLED: "Cancelado",
  PENDING_RENEWAL: "Renovação Pendente",
};

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  EXPIRED: "bg-red-100 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-600",
  PENDING_RENEWAL: "bg-yellow-100 text-yellow-700",
};

export function ContractList() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filtered, setFiltered] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const data = await contractService.list();
        setContracts(data);
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
    let result = contracts;

    if (search) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.number.toLowerCase().includes(search.toLowerCase()) ||
        c.client.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(c => c.status === statusFilter);
    }

    setFiltered(result);
  }, [search, statusFilter, contracts]);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este contrato?")) return;
    try {
      await contractService.remove(id);
      setContracts(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao excluir contrato");
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
        <p className="text-sm text-slate-500">{filtered.length} contrato(s) encontrado(s)</p>
        <button
          onClick={() => navigate("/contracts/new")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Contrato
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por título, número ou cliente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="ALL">Todos os status</option>
          <option value="ACTIVE">Ativos</option>
          <option value="EXPIRED">Vencidos</option>
          <option value="CANCELLED">Cancelados</option>
          <option value="PENDING_RENEWAL">Renovação Pendente</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Nenhum contrato encontrado
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contrato</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vencimento</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(contract => (
                <tr key={contract.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{contract.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{contract.number}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{contract.client.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    R$ {Number(contract.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(contract.endDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[contract.status]}`}>
                      {statusLabel[contract.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/contracts/${contract.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                        className="text-slate-600 hover:text-slate-800 text-xs font-medium cursor-pointer"
                      >
                        Editar
                      </button>
                      {isAdmin && contract.status === "CANCELLED" && (
                        <button
                          onClick={() => handleDelete(contract.id)}
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