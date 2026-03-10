import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/userService";
import type { User } from "../../types";

const roleColor: Record<string, string> = {
  ADMIN: "bg-blue-100 text-blue-700",
  EDITOR: "bg-slate-100 text-slate-600",
};

export function UserList() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingRole, setChangingRole] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await userService.list();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleRoleChange(id: string, role: string) {
    if (!confirm(`Alterar role para "${role}"?`)) return;
    setChangingRole(id);
    try {
      const updated = await userService.updateRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: updated.role } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao alterar role");
    } finally {
      setChangingRole(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await userService.remove(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao excluir usuário");
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
        <p className="text-sm text-slate-500">{users.length} usuário(s) cadastrado(s)</p>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Nenhum usuário encontrado
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuário</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cadastrado em</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition">

                  {/* Nome + badge se for o próprio */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        {user.id === currentUser?.id && (
                          <p className="text-xs text-blue-500">Você</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">{user.email}</td>

                  {/* Role com select inline */}
                  <td className="px-6 py-4">
                    {user.id === currentUser?.id ? (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColor[user.role]}`}>
                        {user.role}
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        disabled={changingRole === user.id}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${roleColor[user.role]}`}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                      </select>
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4">
                    {user.id !== currentUser?.id ? (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                      >
                        Excluir
                      </button>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
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