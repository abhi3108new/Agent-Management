
import { Agent, ApiResponse, Contact, Distribution, LoginCredentials, User } from './types';

// This is a mock API implementation
// In a real application, this would connect to a backend server
class ApiService {
  private token: string | null = null;
  private mockDelay = 600; // Simulate network delay
  
  // Mock data
  private mockUser: User = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  };
  
  private mockAgents: Agent[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+1234567890',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      mobile: '+9876543210',
      createdAt: new Date().toISOString(),
    },
  ];
  
  private mockContacts: Contact[] = [];
  
  private mockDistributions: Distribution[] = [
    {
      id: '1',
      name: 'January Campaign',
      date: new Date().toISOString(),
      totalContacts: 25,
      totalAgents: 5,
      status: 'completed',
    },
  ];

  // Helper for mock responses
  private async mockResponse<T>(data: T, succeed = true): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: succeed,
          data: succeed ? data : undefined,
          error: succeed ? undefined : 'An error occurred',
        });
      }, this.mockDelay);
    });
  }

  // Auth methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    // Mock login validation
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const token = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
      this.setToken(token);
      return this.mockResponse({ user: this.mockUser, token });
    }
    return this.mockResponse({ user: this.mockUser, token: '' }, false);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = this.getToken();
    if (!token) return this.mockResponse(this.mockUser, false);
    return this.mockResponse(this.mockUser);
  }

  async logout(): Promise<ApiResponse<null>> {
    this.clearToken();
    return this.mockResponse(null);
  }

  // Agents
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    return this.mockResponse([...this.mockAgents]);
  }

  async createAgent(agent: Omit<Agent, 'id' | 'createdAt'>): Promise<ApiResponse<Agent>> {
    const newAgent: Agent = {
      id: Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
      ...agent,
    };
    this.mockAgents.push(newAgent);
    return this.mockResponse(newAgent);
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    const index = this.mockAgents.findIndex(a => a.id === id);
    if (index === -1) return this.mockResponse({} as Agent, false);
    
    this.mockAgents[index] = { ...this.mockAgents[index], ...data };
    return this.mockResponse(this.mockAgents[index]);
  }

  async deleteAgent(id: string): Promise<ApiResponse<null>> {
    const index = this.mockAgents.findIndex(a => a.id === id);
    if (index === -1) return this.mockResponse(null, false);
    
    this.mockAgents.splice(index, 1);
    return this.mockResponse(null);
  }

  // Contacts and distributions
  async uploadAndDistributeContacts(file: File): Promise<ApiResponse<Distribution>> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // For this mock implementation, we'll just create random contacts
          const contacts: Contact[] = [];
          const contactCount = Math.floor(Math.random() * 30) + 10; // 10-40 contacts
          
          for (let i = 0; i < contactCount; i++) {
            contacts.push({
              id: Math.random().toString(36).substring(2),
              firstName: `Contact ${i + 1}`,
              phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
              notes: `Sample note for contact ${i + 1}`,
            });
          }
          
          // Distribute contacts among agents
          if (this.mockAgents.length > 0) {
            contacts.forEach((contact, index) => {
              const agentIndex = index % this.mockAgents.length;
              contact.agentId = this.mockAgents[agentIndex].id;
              contact.agentName = this.mockAgents[agentIndex].name;
            });
          }
          
          // Save contacts
          this.mockContacts = [...contacts];
          
          // Create distribution record
          const distribution: Distribution = {
            id: Math.random().toString(36).substring(2),
            name: `Distribution ${new Date().toLocaleDateString()}`,
            date: new Date().toISOString(),
            totalContacts: contacts.length,
            totalAgents: this.mockAgents.length,
            status: 'completed',
          };
          
          this.mockDistributions.push(distribution);
          
          setTimeout(() => {
            resolve(this.mockResponse(distribution));
          }, this.mockDelay);
        } catch (error) {
          setTimeout(() => {
            resolve(this.mockResponse({} as Distribution, false));
          }, this.mockDelay);
        }
      };
      
      reader.readAsText(file);
    });
  }

  async getDistributions(): Promise<ApiResponse<Distribution[]>> {
    return this.mockResponse([...this.mockDistributions]);
  }

  async getDistribution(id: string): Promise<ApiResponse<{ distribution: Distribution; contacts: Contact[] }>> {
    const distribution = this.mockDistributions.find(d => d.id === id);
    if (!distribution) return this.mockResponse({} as any, false);
    
    return this.mockResponse({
      distribution,
      contacts: [...this.mockContacts],
    });
  }

  async getAgentContacts(agentId: string): Promise<ApiResponse<Contact[]>> {
    const agentContacts = this.mockContacts.filter(c => c.agentId === agentId);
    return this.mockResponse(agentContacts);
  }
}

// Create and export singleton instance
const api = new ApiService();
export default api;
