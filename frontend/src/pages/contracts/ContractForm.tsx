import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contractService } from "../../services/contractService";
import { clientService } from "../../services/clientService";
import { userService } from "../../services/userService";
import type { Client, User } from "../../types";

export function ContractForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    number: "",
    value: "",
    startDate: "",
    endDate: "",
    clientId: "",
    responsibleId: "",
    description: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [clientsData, usersData] = await Promise.all([
          clientService.list(),
          userService.list(),
        ]);
        setClients(clientsData);
        setUsers(usersData);

        if (isEditing) {
          const contract = await contractService.detail(id);
          setForm({
            title: contract.title,
            number: contract.number,
            value: String(contract.value),
            startDate: contract.startDate.substring(0, 10),
            endDate: contract.endDate.substring(0, 10),
            clientId: contract.client.id,
            responsibleId: contract.responsible.id,
            description: contract.description || "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        value: Number(form.value),
      };

      if (isEditing) {
        await contractService.update(id, payload);
      } else {
        await contractService.create(payload);
      }

      navigate("/contracts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao salvar contrato");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-6">

        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          {isEditing ? "Editar Contrato" : "Novo Contrato"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Ex: Contrato de Prestação de Serviços"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número *</label>
              <input
                name="number"
                value={form.number}
                onChange={handleChange}
                required
                placeholder="Ex: CTR-2026-001"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$) *</label>
            <input
              name="value"
              type="number"
              step="0.01"
              value={form.value}
              onChange={handleChange}
              required
              placeholder="0.00"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início *</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Vencimento *</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Responsável *</label>
            <select
              name="responsibleId"
              value={form.responsibleId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Selecione um responsável</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Observações adicionais..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/contracts")}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2 rounded-lg transition cursor-pointer"
            >
              {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Contrato"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}