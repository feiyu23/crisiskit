import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { IncidentResponse, UrgencyLevel } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { StatusBadge } from './StatusBadge';
import { RelativeTime } from './RelativeTime';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  responses: IncidentResponse[];
}

interface ParsedLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  url?: string;
}

// Parse GPS coordinates from location string
// Format: "22.12345, 114.54321 (±10m) https://..."
const parseLocation = (location: string): ParsedLocation | null => {
  // Try to extract coordinates - support multiple formats
  const coordRegex = /(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/;
  const match = location.match(coordRegex);

  if (!match) return null;

  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);

  // Validate Hong Kong coordinates (approximate boundaries)
  if (lat < 22.1 || lat > 22.6 || lng < 113.8 || lng > 114.5) {
    return null;
  }

  // Extract accuracy if present
  const accuracyMatch = location.match(/±(\d+)m/);
  const accuracy = accuracyMatch ? parseInt(accuracyMatch[1]) : undefined;

  // Extract URL if present
  const urlMatch = location.match(/(https?:\/\/[^\s]+)/);
  const url = urlMatch ? urlMatch[1] : undefined;

  return { lat, lng, accuracy, url };
};

// Create custom colored markers based on urgency
const createCustomIcon = (urgency: UrgencyLevel): L.Icon => {
  const colors = {
    CRITICAL: '#dc2626', // red-600
    MODERATE: '#f59e0b', // yellow-500
    LOW: '#9ca3af',      // gray-400
    UNKNOWN: '#9ca3af',  // gray-400
  };

  const color = colors[urgency];
  const isPulsing = urgency === 'CRITICAL';

  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${isPulsing ? `
          <style>
            @keyframes pulse {
              0%, 100% { opacity: 1; r: 16; }
              50% { opacity: 0.3; r: 20; }
            }
            .pulse-ring {
              animation: pulse 2s ease-in-out infinite;
              transform-origin: center;
            }
          </style>
          <circle class="pulse-ring" cx="16" cy="16" r="16" fill="${color}" opacity="0.3"/>
        ` : ''}
      </defs>
      <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28s12-19 12-28c0-6.627-5.373-12-12-12z"
            fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="12" r="4" fill="white"/>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

// Component to handle map bounds fitting
const MapController: React.FC<{ responses: IncidentResponse[] }> = ({ responses }) => {
  const map = useMap();

  useEffect(() => {
    const validLocations = responses
      .map(r => parseLocation(r.location))
      .filter((loc): loc is ParsedLocation => loc !== null);

    if (validLocations.length > 0) {
      const bounds = L.latLngBounds(
        validLocations.map(loc => [loc.lat, loc.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [responses, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ responses }) => {
  // Parse and filter responses with valid locations
  const markersData = useMemo(() => {
    return responses
      .map(response => {
        const location = parseLocation(response.location);
        if (!location) return null;

        return {
          response,
          location,
          urgency: response.aiClassification?.urgency || 'UNKNOWN',
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [responses]);

  // If no valid locations, show message
  if (markersData.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No mappable locations</h3>
          <p className="mt-1 text-sm text-gray-500">
            Responses need GPS coordinates to appear on the map.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Format: "22.12345, 114.54321 (±10m) https://..."
          </p>
        </div>
      </div>
    );
  }

  // Hong Kong center coordinates
  const center: [number, number] = [22.3, 114.2];

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController responses={responses} />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {markersData.map(({ response, location, urgency }) => (
            <Marker
              key={response.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(urgency as UrgencyLevel)}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{response.name}</h3>
                    <UrgencyBadge level={urgency as UrgencyLevel} />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>{' '}
                      <StatusBadge status={response.status || 'pending'} />
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">Contact:</span>{' '}
                      <a
                        href={`tel:${response.contact.replace(/\D/g, '')}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {response.contact}
                      </a>
                    </div>

                    {response.region && (
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>{' '}
                        {response.region}{response.district && ` • ${response.district}`}
                      </div>
                    )}

                    {location.accuracy && (
                      <div>
                        <span className="font-medium text-gray-700">Accuracy:</span>{' '}
                        ±{location.accuracy}m
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-gray-700">Needs:</span>
                      <p className="text-gray-600 mt-1 line-clamp-3">{response.needs}</p>
                    </div>

                    {response.aiClassification?.reasoning && (
                      <div>
                        <span className="font-medium text-gray-700">AI Assessment:</span>
                        <p className="text-gray-600 mt-1 italic">{response.aiClassification.reasoning}</p>
                      </div>
                    )}

                    <div className="text-gray-500 pt-2 border-t">
                      <RelativeTime timestamp={response.submittedAt} />
                    </div>

                    {location.url && (
                      <div className="pt-2">
                        <a
                          href={location.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open in Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
