import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-[#00A4E4]" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Reports & Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                Last 30 Days
              </button>
              <button className="btn-primary flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Asset Value Trend</h3>
              <TrendingUp className="h-5 w-5 text-[#00A4E4]" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Chart Placeholder</span>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Asset Distribution</h3>
              <PieChart className="h-5 w-5 text-[#00A4E4]" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Chart Placeholder</span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Asset Utilization', value: '87%', change: '+2.3%' },
                { label: 'Maintenance Cost', value: '$12,450', change: '-5.1%' },
                { label: 'ROI', value: '142%', change: '+12.5%' },
              ].map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">{metric.label}</div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{metric.value}</div>
                    <span className={`ml-2 text-sm font-medium ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;