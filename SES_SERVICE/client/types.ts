export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'archived';
}

export interface WebhookConfig {
  email: string;
  domain: string;
  isActive: boolean;
}

export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}