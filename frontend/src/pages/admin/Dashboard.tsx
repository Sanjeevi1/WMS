import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stats from '../../components/Stats';
import Map from '../../components/Map';

interface DashboardData {
  totalRequests: number;
  pendingRequests: number;
  activeDrivers: number;
  completedRequests: number;
  driverLocations: Array<{
    driverId: string;
    location: {
      lat: number;
      lng: number;
    };
    status: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard');
        setDashboardData(response.data);
      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <Stats
        totalRequests={dashboardData.totalRequests}
        pendingRequests={dashboardData.pendingRequests}
        activeDrivers={dashboardData.activeDrivers}
        completedRequests={dashboardData.completedRequests}
      />

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Driver Locations</h2>
        <div className="h-96">
          <Map driverLocations={dashboardData.driverLocations} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 