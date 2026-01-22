import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Address } from '../../redux/types/orderTypes';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeliveryMapProps {
  address: Address;
}

// Component to recenter map when coordinates change
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function DeliveryMap({ address }: DeliveryMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If coordinates exist in the address object, use them
    if (
      address.coordinates &&
      address.coordinates.lat &&
      address.coordinates.lng
    ) {
      setCoordinates([address.coordinates.lat, address.coordinates.lng]);
      setLoading(false);
      return;
    }

    // Otherwise, attempt to geocode the address
    const fetchCoordinates = async () => {
      try {
        // Strategy: Use Photon API (Komoot) which is more CORS-friendly for frontend apps
        // Note: Photon prioritizes broad searches, so we try City/Zip first if full address is too specific

        // Helper to normalize strings for comparison
        const normalize = (str: string) =>
          str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
        const targetZip = normalize(address.postalCode);

        // Strategy 1: Full Address
        let query = `${address.line1}, ${address.city}, ${address.state} ${address.postalCode}`;
        let response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`
        );
        let data = await response.json();

        // Validate Strategy 1
        let isValid = false;
        if (data.features && data.features.length > 0) {
          const resultZip = normalize(data.features[0].properties.postcode);
          // If result has a zip and we have a zip, they MUST match (fuzzy name match shouldn't override zip)
          if (!targetZip || !resultZip || targetZip === resultZip) {
            isValid = true;
          }
        }

        // Strategy 2: Fallback to City + State + Zip
        if (!isValid) {
          query = `${address.city} ${address.state} ${address.postalCode}`;
          response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`
          );
          data = await response.json();

          // Validate Strategy 2
          if (data.features && data.features.length > 0) {
            const resultZip = normalize(data.features[0].properties.postcode);
            if (!targetZip || !resultZip || targetZip === resultZip) {
              isValid = true;
            }
          }
        }

        // Strategy 3: Zip Code Only (Highest Reliability for inaccurate text)
        if (!isValid && targetZip.length >= 5) {
          query = `${address.postalCode}`;
          response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`
          );
          data = await response.json();
          if (data.features && data.features.length > 0) {
            isValid = true;
          }
        }

        if (isValid && data.features && data.features.length > 0) {
          // Photon returns GeoJSON [lon, lat], Leaflet needs [lat, lon]
          const [lon, lat] = data.features[0].geometry.coordinates;
          setCoordinates([lat, lon]);
        } else {
          setError('Location not found');
        }
      } catch (err) {
        setError('Error loading map');
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [address]);

  if (loading) {
    return (
      <div className="w-full h-[200px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm animate-pulse">
        Loading Map...
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="w-full h-[100px] bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm border border-gray-100">
        Map location unavailable
      </div>
    );
  }

  return (
    <div className="w-full h-[250px] rounded-xl overflow-hidden shadow-sm border border-gray-100 mt-4 relative z-0">
      <MapContainer
        center={coordinates}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={coordinates} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            Delivery Location <br /> {address.line1}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
