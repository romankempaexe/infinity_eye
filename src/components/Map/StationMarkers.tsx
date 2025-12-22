import React, { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import { stationUtils } from '@/utils/stationUtils';
import { Station } from '@/types';
import './StationMarker.css';

interface StationMarkersProps {
  onStationClick?: (stationId: number) => void;
  onUtilizationClick?: (stationId: number) => void;
}

const createMarkerIcon = (station: Station, isActive: boolean): DivIcon => {
  const occupancyClass = stationUtils.getOccupancyClass(station);
  const activeClass = isActive ? 'active' : '';

  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div class="bike-marker ${occupancyClass} ${activeClass}">
        <div class="bike-marker__sparkle"></div>
        <div class="bike-marker__pin">
          <span class="bike-marker__icon">🚲</span>
        </div>
        <div class="bike-marker__tail"></div>
        <div class="bike-marker__shadow"></div>
      </div>
    `,
    iconSize: [56, 78],
    iconAnchor: [28, 70],
    popupAnchor: [0, -70],
  });
};

const StationMarker: React.FC<{
  station: Station;
  isActive: boolean;
  onStationClick?: (stationId: number) => void;
  onUtilizationClick?: (stationId: number) => void;
}> = ({ station, isActive, onStationClick, onUtilizationClick }) => {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isActive && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isActive]);

  const icon = createMarkerIcon(station, isActive);
  const freeSlots = stationUtils.getFreeSlots(station);
  const occupancyLabel = stationUtils.getOccupancyLabel(station);
  const address = stationUtils.getAddressLabel(station);

  return (
    <Marker
      ref={markerRef}
      position={[station.center.lat, station.center.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onStationClick?.(station.id),
      }}
      zIndexOffset={isActive ? 1000 : 0}
    >
      <Popup>
        <div className="marker-popup">
          <div className="marker-popup-address">{address}</div>
          <span className="marker-popup-label">{occupancyLabel}</span>
          <span className="marker-popup-free">Free slots: {freeSlots}</span>
          <button
            className="popup-utilization-btn"
            onClick={() => onUtilizationClick?.(station.id)}
          >
            📊 View Utilization
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

const StationMarkers: React.FC<StationMarkersProps> = ({ onStationClick, onUtilizationClick }) => {
  const stations = useAppStore((state) => state.stations);
  const focusedStationId = useAppStore((state) => state.focusedStationId);

  return (
    <>
      {stations.map((station) => (
        <StationMarker
          key={station.id}
          station={station}
          isActive={station.id === focusedStationId}
          onStationClick={onStationClick}
          onUtilizationClick={onUtilizationClick}
        />
      ))}
    </>
  );
};

export default StationMarkers;
