import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Map from '../../components/Map';
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
  userId?: {
    name: string;
    email: string;
  };
}

interface RouteData {
  currentRequest: Request | null;
  upcomingRequests: Request[];
  driverLocation: {
    lat: number;
    lng: number;
  };
}

const DEFAULT_LOCATION = {
  lat: 0,
  lng: 0
};

const MyRoute: React.FC = () => {
  const [routeData, setRouteData] = useState<RouteData>({
    currentRequest: null,
    upcomingRequests: [],
    driverLocation: DEFAULT_LOCATION
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRouteData = async () => {
    try {
      const response = await axios.get('/api/driver/my-route');
      setRouteData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch route data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteData();
    const interval = setInterval(fetchRouteData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleResolveRequest = async (requestId: string) => {
    try {
      await axios.post('/api/driver/resolve-request', { requestId });
      fetchRouteData(); // Refresh data after resolution
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resolve request');
    }
  };

  // Update location periodically
  useEffect(() => {
    const updateLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude, accuracy } = position.coords;
              
              // Validate coordinates before sending
              if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
                console.error('Invalid coordinates:', { latitude, longitude });
                return;
              }

              // Ensure proper GeoJSON format
              const locationData = {
                lastLocation: {
                  type: 'Point',
                  coordinates: [
                    parseFloat(longitude.toFixed(6)),
                    parseFloat(latitude.toFixed(6))
                  ]
                }
              };

              const response = await axios.post('/api/driver/location', locationData);

              // Update local state with confirmed location
              if (response.data?.location) {
                setRouteData(prev => ({
                  ...prev,
                  driverLocation: {
                    lat: latitude,
                    lng: longitude
                  }
                }));
              }
            } catch (err: any) {
              const errorMessage = err.response?.data?.details || 
                                 err.response?.data?.message || 
                                 'Failed to update location';
              
              // Log detailed error information
              console.error('Location update error:', {
                message: errorMessage,
                response: err.response?.data,
                status: err.response?.status
              });

              setError(errorMessage);
              
              // Clear error after 5 seconds
              setTimeout(() => setError(''), 5000);
            }
          },
          (err) => {
            const errorMessage = `Geolocation error: ${err.message}`;
            console.error('Geolocation error:', {
              code: err.code,
              message: err.message
            });
            setError(errorMessage);
            
            // Clear error after 5 seconds
            setTimeout(() => setError(''), 5000);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
      }
    };

    updateLocation(); // Initial update
    const interval = setInterval(updateLocation, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Route</h1>

      {routeData.currentRequest && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Current Request</h2>
          <RequestCard
            request={routeData.currentRequest}
            onResolve={() => handleResolveRequest(routeData.currentRequest!._id)}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Route Map</h2>
        <div className="h-96">
          <Map
            driverLocations={[
              {
                driverId: 'current',
                location: routeData.driverLocation || DEFAULT_LOCATION,
                status: 'active'
              }
            ]}
          />
        </div>
      </div>

      {routeData.upcomingRequests?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Upcoming Requests</h2>
          <div className="space-y-4">
            {routeData.upcomingRequests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                onResolve={() => handleResolveRequest(request._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRoute; 