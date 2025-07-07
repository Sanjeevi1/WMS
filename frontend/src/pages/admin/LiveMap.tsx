import React, { useState, useEffect } from 'react';
import Map from '../../components/Map';

interface DriverLocation {
  driverId: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
}

const LiveMap: React.FC = () => {
  const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([]);

  useEffect(() => {
    // TODO: Implement WebSocket connection for real-time updates
    // For now, using dummy data
    setDriverLocations([
      {
        driverId: '1',
        location: {
          lat: 51.505,
          lng: -0.09
        },
        status: 'Active'
      },
      {
        driverId: '2',
        location: {
          lat: 51.51,
          lng: -0.1
        },
        status: 'Active'
      }
    ]);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Live Driver Tracking</h1>
      <div className="bg-white rounded-lg shadow-lg p-4" style={{ height: '600px' }}>
        <Map driverLocations={driverLocations} />
      </div>
    </div>
  );
};

export default LiveMap; 