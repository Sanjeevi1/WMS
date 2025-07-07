import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface DriverLocation {
  driverId: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
}

interface MapProps {
  driverLocations?: DriverLocation[];  // Make it optional
}

const DEFAULT_CENTER: [number, number] = [51.505, -0.09]; // Default to London

const Map: React.FC<MapProps> = ({ driverLocations = [] }) => {  // Provide default empty array
  // Calculate center based on driver locations or use default
  const center = driverLocations.length > 0
    ? [
        driverLocations.reduce((sum, loc) => sum + loc.location.lat, 0) / driverLocations.length,
        driverLocations.reduce((sum, loc) => sum + loc.location.lng, 0) / driverLocations.length
      ] as [number, number]
    : DEFAULT_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {driverLocations.map((driver) => (
        <Marker
          key={driver.driverId}
          position={[driver.location.lat, driver.location.lng]}
        >
          <Popup>
            Driver ID: {driver.driverId}<br />
            Status: {driver.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map; 