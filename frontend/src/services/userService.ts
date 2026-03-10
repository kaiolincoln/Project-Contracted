import { api } from "./api";
import type { User } from "../types";

export const userService = {
  async list(): Promise<User[]> {
    const response = await api.get("/users");
    return response.data;
  },

  async updateRole(id: string, role: string): Promise<User> {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};