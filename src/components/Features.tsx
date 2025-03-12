import React from 'react';
import { BarChart3, Building2, Cloud, Database, Globe2, Shield } from 'lucide-react';

const features = [
  {
    icon: Cloud,
    title: 'Cloud-Based Solution',
    description: 'Access your asset data from anywhere, anytime with our secure cloud platform.'
  },
  {
    icon: Database,
    title: 'Customizable Database',
    description: 'Build your perfect asset tracking solution with custom fields and workflows.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Make data-driven decisions with powerful reporting and analytics tools.'
  },
  {
    icon: Building2,
    title: 'Enterprise Ready',
    description: 'Scale your asset management across multiple locations and departments.'
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Keep your data safe with enterprise-grade security and compliance.'
  },
  {
    icon: Globe2,
    title: 'Global Support',
    description: '24/7 support and implementation assistance worldwide.'
  }
];

const Features = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Assets
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to give you complete control
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <feature.icon className="h-12 w-12 text-[#00A4E4] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;