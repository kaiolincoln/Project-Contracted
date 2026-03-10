import { api } from "./api";
import type { Client } from "../types";

export const clientService = {
  async list(): Promise<Client[]> {
    const response = await api.get("/clients");
    return response.data;
  },

  async detail(id: string): Promise<Client> {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  async create(data: object): Promise<Client> {
    const response = await api.post("/clients", data);
    return response.data;
  },

  async update(id: string, data: object): Promise<Client> {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};