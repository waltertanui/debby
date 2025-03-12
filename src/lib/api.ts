import { supabase } from './supabase';
import type { DashboardStats, Asset, AssetActivity, User, AuditLog, Notification } from './types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data: assets } = await supabase
    .from('assets')
    .select('*');

  const { data: activities } = await supabase
    .from('asset_activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const categories = assets?.reduce((acc: { [key: string]: number }, asset: Asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categories || {}).map(([category, count]) => ({
    category,
    count,
  }));

  return {
    totalAssets: assets?.length || 0,
    activeUsers: new Set(assets?.map(a => a.user_id)).size,
    alerts: activities?.filter(a => a.action.includes('alert')).length || 0,
    totalValue: assets?.reduce((sum, asset) => sum + Number(asset.value), 0) || 0,
    categories: categoryData,
  };
}

export async function getRecentActivities(): Promise<AssetActivity[]> {
  const { data } = await supabase
    .from('asset_activities')
    .select(`
      *,
      asset:assets(*)
    `)
    .order('created_at', { ascending: false })
    .limit(3);

  return data || [];
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

export async function createAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>) {
  return supabase.from('audit_logs').insert([log]);
}

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export async function markNotificationAsRead(id: string) {
  return supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
}

export async function updateAsset(
  id: string,
  updates: Partial<Asset>,
  auditDetails: Record<string, any>
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const [updateResult, _] = await Promise.all([
    supabase
      .from('assets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id),
    createAuditLog({
      user_id: user?.id || '',
      action: 'update',
      resource_type: 'asset',
      resource_id: id,
      changes: auditDetails
    })
  ]);

  return updateResult;
}

export async function scheduleAssetMaintenance(
  assetId: string,
  date: string,
  notes: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const [updateResult, notificationResult] = await Promise.all([
    updateAsset(assetId, { 
      next_maintenance: date,
      status: 'maintenance'
    }, {
      type: 'maintenance_scheduled',
      date,
      notes
    }),
    supabase.from('notifications').insert([{
      user_id: user?.id,
      title: 'Maintenance Scheduled',
      message: `Maintenance scheduled for asset on ${new Date(date).toLocaleDateString()}`,
      type: 'info'
    }])
  ]);

  return updateResult;
}

export async function assignAsset(
  assetId: string,
  userId: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const [updateResult, notificationResult] = await Promise.all([
    updateAsset(assetId, { 
      assigned_to: userId,
      lifecycle_stage: 'in-use'
    }, {
      type: 'asset_assigned',
      assigned_to: userId
    }),
    supabase.from('notifications').insert([{
      user_id: userId,
      title: 'Asset Assigned',
      message: 'A new asset has been assigned to you',
      type: 'info'
    }])
  ]);

  return updateResult;
}