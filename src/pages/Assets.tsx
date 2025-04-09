import React, { useState, useEffect } from 'react';
import { Package, Filter, Plus, Search, MoreVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Asset } from '../lib/types';
import AddAssetForm from '../components/AddAssetForm';
import Layout from '../components/Layout';

const Assets = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAssets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (asset.employee_name && asset.employee_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (asset.employee_id && asset.employee_id.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || asset.status.toLowerCase() === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-[#00A4E4]" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Assets</h1>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Asset
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A4E4] w-64"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  Filters
                </button>
              </div>
              <div className="flex space-x-2">
                {['all', 'active', 'maintenance', 'retired'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedFilter === filter
                        ? 'bg-[#00A4E4] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading assets...</div>
            ) : filteredAssets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No assets found. Add your first asset to get started!
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{asset.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          asset.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : asset.status === 'Maintenance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.employee_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.employee_id || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${asset.value.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showAddForm && (
        <AddAssetForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            loadAssets();
            setShowAddForm(false);
          }}
        />
      )}
    </Layout>
  );
};

export default Assets;