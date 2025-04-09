import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Package, Users, AlertCircle, Settings, Search, Plus } from 'lucide-react';
import { getDashboardStats, getRecentActivities } from '../lib/api';
import type { DashboardStats, AssetActivity } from '../lib/types';
import AddAssetForm from '../components/AddAssetForm';
import NotificationCenter from '../components/NotificationCenter';
import Layout from '../components/Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<AssetActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, recentActivities] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(),
      ]);
      setStats(dashboardStats);
      setActivities(recentActivities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Assets', value: stats?.totalAssets.toString() || '0', icon: Package },
    { label: 'Active Users', value: stats?.activeUsers.toString() || '0', icon: Users },
    { label: 'Alerts', value: stats?.alerts.toString() || '0', icon: AlertCircle },
    { label: 'Asset Value', value: stats?.totalValue ? `$${stats.totalValue.toLocaleString()}` : '$0', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <h1 className="flex items-center text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A4E4]"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <NotificationCenter />
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-[#00A4E4] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#0093cd] transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Asset
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-[#00A4E4]" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.label}
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <div className="mt-4 space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        Asset: {activity.asset?.name} • {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Asset Categories</h3>
              <div className="mt-4 space-y-4">
                {stats?.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category.category}</span>
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#00A4E4] h-2 rounded-full"
                        style={{ width: `${(category.count / stats.totalAssets) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAddForm && (
        <AddAssetForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            loadDashboardData();
            setShowAddForm(false);
          }}
        />
      )}
    </Layout>
  );
};

export default Dashboard;