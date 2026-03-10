import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contractService } from "../../services/contractService";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
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

const allStatuses = ["ACTIVE", "EXPIRED", "CANCELLED", "PENDING_RENEWAL"];

const actionLabel: Record<string, string> = {
  CONTRACT_CREATED: "Contrato criado",
  STATUS_CHANGED: "Status alterado",
  VALUE_UPDATED: "Valor atualizado",
  DOC_UPLOADED: "Documento anexado",
  DOC_DELETED: "Documento removido",
  CONTRACT_DELETED: "Contrato excluído",
};

export function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "history">("info");

  async function load() {
    try {
      const data = await contractService.detail(id!);
      setContract(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleStatusChange(status: string) {
    if (!confirm(`Alterar status para "${statusLabel[status]}"?`)) return;
    try {
      await contractService.updateStatus(id!, status);
      await load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao alterar status");
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/contracts/${id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await load();
      setActiveTab("documents");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao fazer upload");
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeleteDocument(docId: string) {
    if (!confirm("Remover este documento?")) return;
    try {
      await api.delete(`/documents/${docId}`);
      await load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao remover documento");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Carregando...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center text-slate-500 py-16">
        Contrato não encontrado
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-slate-900">{contract.title}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[contract.status]}`}>
                {statusLabel[contract.status]}
              </span>
            </div>
            <p className="text-sm text-slate-500">{contract.number}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate(`/contracts/${id}/edit`)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Editar
            </button>

            {/* Mudar status */}
            <select
              value={contract.status}
              onChange={e => handleStatusChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {allStatuses.map(s => (
                <option key={s} value={s}>{statusLabel[s]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Info resumida */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <InfoItem label="Valor" value={`R$ ${Number(contract.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
          <InfoItem label="Cliente" value={contract.client.name} />
          <InfoItem label="Responsável" value={contract.responsible.name} />
          <InfoItem
            label="Vencimento"
            value={new Date(contract.endDate).toLocaleDateString("pt-BR")}
          />
        </div>

        {contract.description && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium mb-1">Descrição</p>
            <p className="text-sm text-slate-700">{contract.description}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          {(["info", "documents", "history"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition cursor-pointer ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "info" && "Informações"}
              {tab === "documents" && `Documentos (${contract.documents?.length ?? 0})`}
              {tab === "history" && "Histórico"}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* Tab Info */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Início" value={new Date(contract.startDate).toLocaleDateString("pt-BR")} />
              <InfoItem label="Vencimento" value={new Date(contract.endDate).toLocaleDateString("pt-BR")} />
              <InfoItem label="Documento do Cliente" value={contract.client.document} />
              <InfoItem label="Criado em" value={new Date(contract.createdAt).toLocaleDateString("pt-BR")} />
            </div>
          )}

          {/* Tab Documentos */}
          {activeTab === "documents" && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploadLoading ? "Enviando..." : "Anexar PDF/DOCX"}
                </button>
              </div>

              {!contract.documents?.length ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Nenhum documento anexado
                </div>
              ) : (
                <div className="space-y-2">
                  {contract.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                          <p className="text-xs text-slate-400">
                            {doc.size ? `${(doc.size / 1024).toFixed(1)} KB · ` : ""}
                            {new Date(doc.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        
                          href={`http://localhost:3333/documents/${doc.id}/download`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer"
                      
                          Baixar
    
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Histórico */}
          {activeTab === "history" && (
            <div className="space-y-3">
              {!contract.history?.length ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Nenhuma atividade registrada
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
                  <div className="space-y-4">
                    {contract.history.map(item => (
                      <div key={item.id} className="flex gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-400 shrink-0 z-10" />
                        <div className="pb-2">
                          <p className="text-sm font-medium text-slate-800">
                            {actionLabel[item.action] ?? item.action}
                          </p>
                          {item.detail && (
                            <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            {item.user.name} · {new Date(item.createdAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Botão voltar */}
      <button
        onClick={() => navigate("/contracts")}
        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
      >
        ← Voltar para contratos
      </button>

    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}