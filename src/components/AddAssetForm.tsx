import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Asset } from '../lib/types';

interface AddAssetFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ['IT Equipment', 'Office Furniture', 'Vehicles', 'Tools', 'Software'];
const LOCATIONS = ['HQ Office', 'Branch A', 'Branch B', 'Remote'];
const STATUSES = ['Active', 'Maintenance', 'Retired'];

const AddAssetForm: React.FC<AddAssetFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '',
    category: CATEGORIES[0],
    status: STATUSES[0],
    location: LOCATIONS[0],
    value: undefined,
    employee_name: '',
    employee_id: '',
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Asset name is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    
    if (!formData.location) {
      errors.location = 'Location is required';
    }
    
    if (formData.value === undefined || formData.value === null || isNaN(Number(formData.value))) {
      errors.value = 'Valid value is required';
    }
    
    if (!formData.employee_name?.trim()) {
      errors.employee_name = 'Employee name is required';
    }
    
    if (!formData.employee_id?.trim()) {
      errors.employee_id = 'Employee ID is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('assets')
        .insert([
          {
            ...formData,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

      if (insertError) throw insertError;

      // Create activity record
      await supabase
        .from('asset_activities')
        .insert([
          {
            action: `Added new asset: ${formData.name}`,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? (value ? parseFloat(value) : undefined) : value,
    }));
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-5 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Asset</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Asset Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm focus:ring-[#00A4E4] focus:border-[#00A4E4] px-4 py-2.5 ${
                validationErrors.name 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm focus:ring-[#00A4E4] focus:border-[#00A4E4] px-4 py-2.5 ${
                validationErrors.category 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm focus:ring-[#00A4E4] focus:border-[#00A4E4] px-4 py-2.5 ${
                validationErrors.status 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            >
              {STATUSES.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {validationErrors.status && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.status}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm focus:ring-[#00A4E4] focus:border-[#00A4E4] px-4 py-2.5 ${
                validationErrors.location 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            >
              {LOCATIONS.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {validationErrors.location && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
            )}
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Value ($)
            </label>
            <input
              type="number"
              id="value"
              name="value"
              min="0"
              step="0.01"
              value={formData.value === undefined ? '' : formData.value}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm focus:ring-[#00A4E4] focus:border-[#00A4E4] px-4 py-2.5 ${
                validationErrors.value 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            />
            {validationErrors.value && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.value}</p>
            )}
          </div>
          
          {/* Employee fields - updated to be required */}
          <div>
            <label htmlFor="employee_name" className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name
            </label>
            <input
              type="text"
              id="employee_name"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm focus:ring-[#00A4E4] focus:border-[#00A4E4] px-3 py-2 ${
                validationErrors.employee_name 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            />
            {validationErrors.employee_name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.employee_name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm focus:ring-[#00A4E4] focus:border-[#00A4E4] px-3 py-2 ${
                validationErrors.employee_id 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
            />
            {validationErrors.employee_id && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.employee_id}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#00A4E4] text-white rounded-md font-medium hover:bg-[#0093cd] disabled:opacity-50 transition-colors shadow-sm text-sm"
            >
              {loading ? 'Adding...' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetForm;