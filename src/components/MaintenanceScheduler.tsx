import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { scheduleAssetMaintenance } from '../lib/api';

interface MaintenanceSchedulerProps {
  assetId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const MaintenanceScheduler: React.FC<MaintenanceSchedulerProps> = ({
  assetId,
  onClose,
  onSuccess,
}) => {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await scheduleAssetMaintenance(assetId, date, notes);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-[#00A4E4] mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Schedule Maintenance
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Maintenance Date
            </label>
            <input
              type="datetime-local"
              id="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A4E4] focus:ring-[#00A4E4]"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Maintenance Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A4E4] focus:ring-[#00A4E4]"
              placeholder="Enter maintenance details..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#00A4E4] text-white rounded-md hover:bg-[#0093cd] disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceScheduler;