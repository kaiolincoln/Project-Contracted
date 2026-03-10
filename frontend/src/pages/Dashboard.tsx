import { contractService } from "../services/contractService";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import type { Contract, ExpiringContract } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [expiring, setExpiring] = useState<ExpiringContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [contractsData, expiringData] = await Promise.all([
          contractService.list(),
          contractService.expiring(),
        ]);
        setContracts(contractsData);
        setExpiring(expiringData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const total = contracts.length;
  const active = contracts.filter(c => c.status === "ACTIVE").length;
  const expired = contracts.filter(c => c.status === "EXPIRED").length;
  const cancelled = contracts.filter(c => c.status === "CANCELLED").length;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">

      {/* Boas vindas */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Olá, {user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Aqui está o resumo dos seus contratos
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Contratos"
          value={total}
          color="bg-blue-50 text-blue-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Ativos"
          value={active}
          color="bg-green-50 text-green-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Vencidos"
          value={expired}
          color="bg-red-50 text-red-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Cancelados"
          value={cancelled}
          color="bg-slate-50 text-slate-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Alerta de contratos vencendo */}
      {expiring.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-semibold text-yellow-800">
              {expiring.length} contrato(s) vencendo nos próximos 30 dias
            </h3>
          </div>
          <div className="space-y-2">
            {expiring.map(contract => (
              <div
                key={contract.id}
                onClick={() => navigate(`/contracts/${contract.id}`)}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 cursor-pointer hover:bg-yellow-50 transition border border-yellow-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{contract.title}</p>
                  <p className="text-xs text-slate-500">{contract.client.name} · {contract.number}</p>
                </div>
                <span className="text-sm font-semibold text-yellow-700">
                  {contract.daysLeft === 0 ? "Vence hoje!" : `${contract.daysLeft} dias`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Últimos contratos */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Contratos Recentes</h3>
          <button
            onClick={() => navigate("/contracts")}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Ver todos
          </button>
        </div>

        {contracts.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">
            Nenhum contrato cadastrado ainda
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {contracts.slice(0, 5).map(contract => (
              <div
                key={contract.id}
                onClick={() => navigate(`/contracts/${contract.id}`)}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer transition"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{contract.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {contract.client.name} · {contract.number}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-700">
                    R$ {Number(contract.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[contract.status]}`}>
                    {statusLabel[contract.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function StatCard({ label, value, color, icon }: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}