import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
}

interface Driver {
  _id: string;
  name: string;
  vehicleType: string;
  status: string;
}

const Requests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsResponse, driversResponse] = await Promise.all([
          axios.get('/api/admin/requests'),
          axios.get('/api/admin/drivers')
        ]);
        setRequests(requestsResponse.data);
        setDrivers(driversResponse.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAssignDriver = async (requestId: string) => {
    if (!selectedDriver) {
      setError('Please select a driver');
      return;
    }

    try {
      await axios.post('/api/admin/requests/assign', {
        requestId,
        driverId: selectedDriver
      });
      
      // Refresh requests after assignment
      const response = await axios.get('/api/admin/requests');
      setRequests(response.data);
      setSelectedDriver('');
    } catch (err: any) {
      console.error('Error assigning driver:', err);
      setError(err.response?.data?.message || 'Failed to assign driver');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await axios.post('/api/admin/requests/reject', {
        requestId
      });
      
      // Refresh requests after rejection
      const response = await axios.get('/api/admin/requests');
      setRequests(response.data);
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      setError(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleAutoAssign = async () => {
    try {
      await axios.post('/api/admin/requests/auto-assign');
      
      // Refresh requests after auto-assignment
      const response = await axios.get('/api/admin/requests');
      setRequests(response.data);
    } catch (err: any) {
      console.error('Error auto-assigning:', err);
      setError(err.response?.data?.message || 'Failed to auto-assign requests');
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError('')}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const assignedRequests = requests.filter(req => req.status === 'assigned');
  const completedRequests = requests.filter(req => req.status === 'completed');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Waste Collection Requests</h1>
        <button
          onClick={handleAutoAssign}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Auto-Assign All
        </button>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
        <div className="space-y-4">
          {pendingRequests.map(request => (
            <div key={request._id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <RequestCard request={request} />
              <div className="mt-4 flex items-center space-x-4">
                <select
                  className="flex-1 border rounded p-2"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} ({driver.vehicleType})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssignDriver(request._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Assign
                </button>
                <button
                  onClick={() => handleRejectRequest(request._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && (
            <p className="text-gray-500 text-center">No pending requests</p>
          )}
        </div>
      </div>

      {/* Assigned Requests */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Assigned Requests</h2>
        <div className="space-y-4">
          {assignedRequests.map(request => (
            <RequestCard key={request._id} request={request} />
          ))}
          {assignedRequests.length === 0 && (
            <p className="text-gray-500 text-center">No assigned requests</p>
          )}
        </div>
      </div>

      {/* Completed Requests */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Completed Requests</h2>
        <div className="space-y-4">
          {completedRequests.map(request => (
            <RequestCard key={request._id} request={request} />
          ))}
          {completedRequests.length === 0 && (
            <p className="text-gray-500 text-center">No completed requests</p>
          )}
        </div>
      </div>

      {/* Rejected Requests */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Rejected Requests</h2>
        <div className="space-y-4">
          {rejectedRequests.map(request => (
            <RequestCard key={request._id} request={request} />
          ))}
          {rejectedRequests.length === 0 && (
            <p className="text-gray-500 text-center">No rejected requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests; 