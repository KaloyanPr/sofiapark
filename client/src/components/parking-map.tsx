import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import type { ParkingLocation, MapCenter } from "@/types/parking";
import "leaflet/dist/leaflet.css";

interface ParkingMapProps {
  locations: ParkingLocation[];
  center: MapCenter;
  onMarkerClick: (location: ParkingLocation) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
}

// Custom marker component to handle map events
function MapEventHandler({ onZoomIn, onZoomOut, onCenter }: { onZoomIn: () => void; onZoomOut: () => void; onCenter: () => void }) {
  const map = useMap();
  
  useEffect(() => {
    const handleZoomIn = () => map.zoomIn();
    const handleZoomOut = () => map.zoomOut();
    const handleCenter = () => map.setView([42.6977, 23.3219], 13);
    
    // Expose methods to parent component
    onZoomIn = handleZoomIn;
    onZoomOut = handleZoomOut;
    onCenter = handleCenter;
  }, [map, onZoomIn, onZoomOut, onCenter]);

  return null;
}

function createParkingMarker(status: string) {
  const color = status === "available" ? "#4CAF50" : status === "limited" ? "#FF9800" : "#F44336";
  
  return divIcon({
    html: `<div style="
      width: 12px;
      height: 12px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    className: "custom-parking-marker",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

export function ParkingMap({ locations, center, onMarkerClick, onZoomIn, onZoomOut, onCenter }: ParkingMapProps) {
  const mapRef = useRef<any>(null);

  // Handle zoom and center actions
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleCenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([42.6977, 23.3219], 13);
    }
  };

  // Update parent handlers when map is ready
  useEffect(() => {
    if (mapRef.current) {
      onZoomIn = handleZoomIn;
      onZoomOut = handleZoomOut;
      onCenter = handleCenter;
    }
  }, [mapRef.current]);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        ref={mapRef}
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
            icon={createParkingMarker(location.status)}
            eventHandlers={{
              click: () => onMarkerClick(location),
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{location.name}</div>
                <div className="text-gray-600">{location.address}</div>
                <div className="mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    location.status === "available" ? "bg-green-500" : 
                    location.status === "limited" ? "bg-orange-500" : "bg-red-500"
                  }`}></span>
                  <span className="capitalize">{location.status}</span>
                  <span className="ml-2 text-gray-500">
                    {location.availableSpots}/{location.totalSpots} spots
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
