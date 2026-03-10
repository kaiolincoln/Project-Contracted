import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clientService } from "../../services/clientService";

export function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    document: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!isEditing) return;
    async function load() {
      try {
        const data = await clientService.detail(id!);
        setForm({
          name: data.name,
          document: data.document,
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
        });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Remove campos vazios opcionais
      const payload: Record<string, string> = { name: form.name, document: form.document };
      if (form.email) payload.email = form.email;
      if (form.phone) payload.phone = form.phone;
      if (form.address) payload.address = form.address;

      if (isEditing) {
        await clientService.update(id!, payload);
      } else {
        await clientService.create(payload);
      }

      navigate("/clients");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-6">

        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          {isEditing ? "Editar Cliente" : "Novo Cliente"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nome completo ou razão social"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CPF / CNPJ *</label>
            <input
              name="document"
              value={form.document}
              onChange={handleChange}
              required
              placeholder="Somente números"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="cliente@email.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(31) 99999-9999"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2 rounded-lg transition cursor-pointer"
            >
              {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Cliente"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}