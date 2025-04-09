export interface Asset {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  value: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  employee_name?: string;
  employee_id?: string;
  lifecycle_stage?: 'new' | 'in-use' | 'maintenance' | 'retired';
  next_maintenance?: string;
  notes?: string;
  attachments?: string[];
}

export interface AssetActivity {
  id: string;
  asset_id: string;
  user_id: string;
  action: string;
  created_at: string;
  asset?: Asset;
  details?: Record<string, any>;
}

export interface DashboardStats {
  totalAssets: number;
  activeUsers: number;
  alerts: number;
  totalValue: number;
  categories: { category: string; count: number }[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes: Record<string, any>;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
}