import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Driver {
  _id: string;
  name: string;
  email: string;
  vehicleType: string;
  status?: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    password: '',
    vehicleType: ''
  });
  const [error, setError] = useState('');

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/api/admin/drivers');
      setDrivers(response.data);
      setFilteredDrivers(response.data);
    } catch (err: any) {
      console.error('Error fetching drivers:', err);
      setError(err.response?.data?.message || 'Failed to fetch drivers');
    }
  };

  useEffect(() => {
    fetchDrivers();
    const interval = setInterval(fetchDrivers, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleVehicleTypeFilter = async (type: string) => {
    setSelectedVehicleType(type);
    try {
      if (type === 'all') {
        setFilteredDrivers(drivers);
      } else {
        const response = await axios.get(`/api/admin/drivers/filter/${type}`);
        setFilteredDrivers(response.data);
      }
    } catch (err: any) {
      console.error('Error filtering drivers:', err);
      setError(err.response?.data?.message || 'Failed to filter drivers');
    }
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/drivers', newDriver);
      setNewDriver({
        name: '',
        email: '',
        password: '',
        vehicleType: ''
      });
      fetchDrivers();
    } catch (err: any) {
      console.error('Error creating driver:', err);
      setError(err.response?.data?.message || 'Failed to create driver');
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Manage Drivers</h1>

      {/* Create Driver Form */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Add New Driver</h2>
        <form onSubmit={handleCreateDriver} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              className="border rounded p-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newDriver.email}
              onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
              className="border rounded p-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newDriver.password}
              onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
              className="border rounded p-2"
              required
            />
            <select
              value={newDriver.vehicleType}
              onChange={(e) => setNewDriver({ ...newDriver, vehicleType: e.target.value })}
              className="border rounded p-2"
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Driver
          </button>
        </form>
      </div>

      {/* Filter Drivers */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-xl font-semibold">Drivers List</h2>
          <select
            value={selectedVehicleType}
            onChange={(e) => handleVehicleTypeFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Vehicles</option>
            <option value="truck">Trucks</option>
            <option value="van">Vans</option>
            <option value="motorcycle">Motorcycles</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredDrivers.map((driver) => (
            <div
              key={driver._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{driver.name}</h3>
                <p className="text-sm text-gray-600">{driver.email}</p>
                <p className="text-sm text-gray-600">Vehicle: {driver.vehicleType}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                  {driver.status || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
          {filteredDrivers.length === 0 && (
            <p className="text-center text-gray-500">No drivers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drivers; 