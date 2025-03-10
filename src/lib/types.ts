
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  phone: string;
  notes: string;
  agentId?: string;
  agentName?: string;
}

export interface Distribution {
  id: string;
  name: string;
  date: string;
  totalContacts: number;
  totalAgents: number;
  status: 'completed' | 'pending';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
