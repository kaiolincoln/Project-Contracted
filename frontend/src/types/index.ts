export type Role = "ADMIN" | "EDITOR";

export type ContractStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING_RENEWAL";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  title: string;
  number: string;
  value: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  description?: string;
  client: {
    id: string;
    name: string;
    document: string;
  };
  responsible: {
    id: string;
    name: string;
  };
  documents?: Document[];
  history?: ContractHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpiringContract extends Contract {
  daysLeft: number;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  size?: number;
  createdAt: string;
}

export interface ContractHistory {
  id: string;
  action: string;
  detail?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  contract: {
    id: string;
    title: string;
    number: string;
  };
}