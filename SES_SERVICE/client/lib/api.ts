import { Inquiry, WebhookConfig, User, UserRole } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006';

const KEYS = {
  CONFIG: 'nexus_config',
  INQUIRIES: 'nexus_inquiries',
  CURRENT_USER: 'nexus_current_user',
  USERS: 'nexus_users',
};

// Default Users
const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Viewer User', role: 'viewer' },
  { id: '2', name: 'Admin User', role: 'admin' },
];

export const db = {
  getConfig: async (): Promise<WebhookConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/webhook-config`);
      if (!response.ok) throw new Error('Failed to fetch config');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching config:', error);
      const data = localStorage.getItem(KEYS.CONFIG);
      return data ? JSON.parse(data) : { email: 'admin@nexus.com', domain: '', isActive: true };
    }
  },

  saveConfig: async (config: WebhookConfig) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/webhook-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to save config');
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
      return true;
    }
  },

  getInquiries: async (): Promise<Inquiry[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries`);
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      const data = localStorage.getItem(KEYS.INQUIRIES);
      return data ? JSON.parse(data) : [];
    }
  },

  addInquiry: async (data: { name: string; email: string; message: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save inquiry');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error adding inquiry:', error);
      // Fallback
      const inquiries = await db.getInquiries();
      const newInq = { ...data, id: Date.now().toString(), date: new Date().toISOString().split('T')[0], status: 'new' as const };
      localStorage.setItem(KEYS.INQUIRIES, JSON.stringify([newInq, ...inquiries]));
      return newInq;
    }
  },

  deleteInquiry: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      return true;
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      const inquiries = await db.getInquiries();
      localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries.filter(i => i.id !== id)));
      return true;
    }
  },

  updateInquiryStatus: async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update');
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      const inquiries = await db.getInquiries();
      localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries.map(i => i.id === id ? { ...i, status } : i)));
      return true;
    }
  }
};

export const userService = {
  getAllUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(data);
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User) => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
};

export const emailService = {
  send: async (to: string, subject: string, html: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: to, subject, html }),
      });
      if (!response.ok) throw new Error('Failed to send email');
      return true;
    } catch (error) {
      console.group('📧 [MOCK EMAIL]');
      console.log(`To: ${to}\nSubject: ${subject}\nBody: ${html}`);
      console.groupEnd();
      return true;
    }
  }
};