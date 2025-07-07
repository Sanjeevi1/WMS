import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import RequestCard from '../../components/RequestCard';

interface Request {
  _id: string;
  address: string;
  status: string;
  description: string;
  requestType: string;
  priority: 'low' | 'medium' | 'high';
  photos: string[];
  createdAt: string;
  completedAt?: string;
}

const History: React.FC = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/driver/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch request history');
      }
    };

    fetchHistory();
  }, [token]);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Request History</h1>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <RequestCard request={request} />
              {request.completedAt && (
                <p className="mt-2 text-sm text-gray-600">
                  Completed: {new Date(request.completedAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
          {requests.length === 0 && (
            <p className="text-center text-gray-500">No request history found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;