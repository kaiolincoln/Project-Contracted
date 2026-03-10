import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

export function Profile() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [infoForm, setInfoForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [infoLoading, setInfoLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  function handleInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInfoForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInfoLoading(true);
    try {
      await api.put("/me", infoForm);
      toast.success("Dados atualizados com sucesso!");

      const storedUser = localStorage.getItem("@contract:user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        localStorage.setItem("@contract:user", JSON.stringify({
          ...parsed,
          name: infoForm.name,
          email: infoForm.email,
        }));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao atualizar dados");
    } finally {
      setInfoLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.patch("/me/Changepassword", passwordForm);
      toast.success("Senha alterada! Faça login novamente.");
      setTimeout(() => signOut(), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao alterar senha");
    } finally {
      setPasswordLoading(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">

      {/* Header do perfil */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs + formulários */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition cursor-pointer ${
              activeTab === "info"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Meus Dados
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition cursor-pointer ${
              activeTab === "password"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Alterar Senha
          </button>
        </div>

        <div className="p-6">

          {/* Tab — Meus Dados */}
          {activeTab === "info" && (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input
                  name="name"
                  value={infoForm.name}
                  onChange={handleInfoChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={infoForm.email}
                  onChange={handleInfoChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={infoLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2.5 rounded-lg transition cursor-pointer"
              >
                {infoLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          )}

          {/* Tab — Alterar Senha */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha Atual</label>
                <input
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
                <input
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-400 mt-1">Mínimo 6 caracteres, uma maiúscula e um número</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nova Senha</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-700">
                  ⚠️ Após alterar a senha você será deslogado automaticamente.
                </p>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2.5 rounded-lg transition cursor-pointer"
              >
                {passwordLoading ? "Alterando..." : "Alterar Senha"}
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}