import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Asset } from '../lib/types';
import Layout from '../components/Layout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*');
          
        if (error) throw error;
        setAssets(data || []);
      } catch (err) {
        console.error('Error fetching assets:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssets();
  }, []);
  
  // Calculate category distribution data
  const categoryData = {
    labels: ['IT Equipment', 'Office Furniture', 'Vehicles', 'Tools', 'Software'],
    datasets: [
      {
        label: 'Assets by Category',
        data: [
          assets.filter(a => a.category === 'IT Equipment').length,
          assets.filter(a => a.category === 'Office Furniture').length,
          assets.filter(a => a.category === 'Vehicles').length,
          assets.filter(a => a.category === 'Tools').length,
          assets.filter(a => a.category === 'Software').length,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate value by location data
  const locationData = {
    labels: ['HQ Office', 'Branch A', 'Branch B', 'Remote'],
    datasets: [
      {
        label: 'Total Asset Value by Location',
        data: [
          assets.filter(a => a.location === 'HQ Office').reduce((sum, asset) => sum + asset.value, 0),
          assets.filter(a => a.location === 'Branch A').reduce((sum, asset) => sum + asset.value, 0),
          assets.filter(a => a.location === 'Branch B').reduce((sum, asset) => sum + asset.value, 0),
          assets.filter(a => a.location === 'Remote').reduce((sum, asset) => sum + asset.value, 0),
        ],
        backgroundColor: 'rgba(0, 164, 228, 0.6)',
        borderColor: 'rgba(0, 164, 228, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Mock data for asset value trend (would be replaced with real historical data)
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Asset Value',
        data: [65000, 72000, 74000, 80000, 82000, 90000],
        fill: false,
        backgroundColor: 'rgba(0, 164, 228, 0.6)',
        borderColor: 'rgba(0, 164, 228, 1)',
        tension: 0.1,
      },
    ],
  };
  
  // Calculate key metrics
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const avgAssetValue = assets.length > 0 ? totalAssetValue / assets.length : 0;
  const maintenanceAssets = assets.filter(a => a.status === 'Maintenance').length;
  const maintenanceRate = assets.length > 0 ? (maintenanceAssets / assets.length) * 100 : 0;
  
  const handleExport = () => {
    // Implementation for exporting reports would go here
    alert('Export functionality would be implemented here');
  };
  
  return (
    <Layout>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-[#00A4E4]" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Reports & Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A4E4] appearance-none bg-white"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last Year</option>
                </select>
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleExport}
                className="btn-primary flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#00A4E4] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading report data...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="text-sm text-gray-500">Total Assets</div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{assets.length}</div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="text-sm text-gray-500">Total Value</div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${totalAssetValue.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="text-sm text-gray-500">Average Asset Value</div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${avgAssetValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="text-sm text-gray-500">Maintenance Rate</div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {maintenanceRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Asset Value Trend</h3>
                  <TrendingUp className="h-5 w-5 text-[#00A4E4]" />
                </div>
                <div className="h-64">
                  <Line 
                    data={trendData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }} 
                  />
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Asset Distribution</h3>
                  <PieChart className="h-5 w-5 text-[#00A4E4]" />
                </div>
                <div className="h-64">
                  <Pie 
                    data={categoryData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }} 
                  />
                </div>
              </div>

              <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Asset Value by Location</h3>
                  <Filter className="h-5 w-5 text-[#00A4E4]" />
                </div>
                <div className="h-64">
                  <Bar 
                    data={locationData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }} 
                  />
                </div>
              </div>
            </div>
            
            {/* Asset Status Summary */}
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Status Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {['Active', 'Maintenance', 'Retired'].map(status => {
                      const statusAssets = assets.filter(a => a.status === status);
                      const count = statusAssets.length;
                      const percentage = assets.length > 0 ? (count / assets.length) * 100 : 0;
                      const value = statusAssets.reduce((sum, asset) => sum + asset.value, 0);
                      
                      return (
                        <tr key={status}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : status === 'Maintenance'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {percentage.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${value.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
};

export default Reports;