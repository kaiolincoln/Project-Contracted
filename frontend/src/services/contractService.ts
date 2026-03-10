import { api } from "./api";
import type { Contract, ExpiringContract } from "../types";

export const contractService = {
  async list(): Promise<Contract[]> {
    const response = await api.get("/contracts");
    return response.data;
  },

  async expiring(): Promise<ExpiringContract[]> {
    const response = await api.get("/contracts/expiring");
    return response.data;
  },

  async detail(id: string): Promise<Contract> {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  async create(data: object): Promise<Contract> {
    const response = await api.post("/contracts", data);
    return response.data;
  },

  async update(id: string, data: object): Promise<Contract> {
    const response = await api.put(`/contracts/${id}`, data);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Contract> {
    const response = await api.patch(`/contracts/${id}/status`, { status });
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/contracts/${id}`);
  },
};