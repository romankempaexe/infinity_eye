import React, { useState, useEffect, useRef } from 'react';
import { LatLng } from 'leaflet';
import L from 'leaflet';
import MapComponent from './components/Map/MapComponent';
import StationPanel from './components/StationPanel/StationPanel';
import Controls from './components/Controls/Controls';
import UtilizationModal from './components/Modal/UtilizationModal';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { useAppStore } from './store/useAppStore';
import { useStations } from './hooks/useStations';
import { useGeocoding } from './hooks/useGeocoding';
import { DEFAULT_MAP_CENTER } from './constants';
import { Coordinates } from './types';
import './App.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStationForModal, setSelectedStationForModal] = useState<number | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  const { addStation, updateStation, deleteStation } = useStations();
  const { reverseGeocodeStation } = useGeocoding(updateStation);
  
  const isDrawingMode = useAppStore((state) => state.isDrawingMode);
  const setDrawingMode = useAppStore((state) => state.setDrawingMode);
  const stations = useAppStore((state) => state.stations);
  const setFocusedStation = useAppStore((state) => state.setFocusedStation);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapClick = (latlng: LatLng) => {
    if (isDrawingMode) {
      const newStation = {
        center: { lat: latlng.lat, lng: latlng.lng },
        bikes: Math.floor(Math.random() * 20),
        capacity: 20,
      };
      
      const newStationId = addStation(newStation);
      setDrawingMode(false);
      
      // Trigger reverse geocoding immediately with the new station
      // Use a microtask to ensure state is updated
      queueMicrotask(() => {
        const addedStation = stations.find(s => s.id === newStationId);
        if (addedStation) {
          reverseGeocodeStation(addedStation, true);
        }
      });
    }
  };

  const handleStationFocus = (stationId: number) => {
    setFocusedStation(stationId);
    const station = stations.find((s) => s.id === stationId);
    if (station) {
      if (!station.address) {
        reverseGeocodeStation(station);
      }
      // Zoom to station
      if (station.center && mapRef.current) {
        const map = mapRef.current;
        const targetZoom = Math.max(map.getZoom(), 16);
        
        map.flyTo([station.center.lat, station.center.lng], targetZoom, {
          animate: true,
          duration: 0.6,
        });
      }
    }
  };

  const handleUtilizationClick = (stationId: number) => {
    setSelectedStationForModal(stationId);
  };

  const handleDeleteStation = (stationId: number) => {
    deleteStation(stationId);
  };

  const handleZoomToCoordinates = (coords: Coordinates, zoom: number = 13) => {
    if (mapRef.current) {
      mapRef.current.setView([coords.lat, coords.lng], zoom, { animate: true });
    }
  };

  const handleZoomToHome = () => {
    if (mapRef.current) {
      mapRef.current.setView(DEFAULT_MAP_CENTER, 13, { animate: true });
    }
  };

  const handleZoomToLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleZoomToCoordinates(
            { lat: position.coords.latitude, lng: position.coords.longitude },
            15
          );
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const selectedStation = selectedStationForModal
    ? stations.find((s) => s.id === selectedStationForModal) || null
    : null;

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      
      <div className="app">
        <MapComponent 
          onMapClick={handleMapClick} 
          mapRef={mapRef}
          onStationClick={handleStationFocus}
          onUtilizationClick={handleUtilizationClick}
        />
        
        <StationPanel
          onStationFocus={handleStationFocus}
          onUtilizationClick={handleUtilizationClick}
          onDeleteStation={handleDeleteStation}
        />
        
        <button
          className={`add-station-btn ${isDrawingMode ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setDrawingMode(!isDrawingMode);
          }}
          title="Add bike station"
        >
          {isDrawingMode ? '✕' : '+'}
        </button>
        
        {isDrawingMode && (
          <div className="drawing-mode-indicator">
            <div>🎯 Station placement mode</div>
            <div className="point-count">Click once on the map to place a station.</div>
            <button className="cancel-polygon-btn" onClick={() => setDrawingMode(false)}>
              ✕ Cancel
            </button>
          </div>
        )}
        
        <Controls
          onZoomToHome={handleZoomToHome}
          onZoomToLocation={handleZoomToLocation}
          onSearchLocation={handleZoomToCoordinates}
        />
        
        <UtilizationModal
          station={selectedStation}
          isOpen={selectedStationForModal !== null}
          onClose={() => setSelectedStationForModal(null)}
        />
      </div>
    </>
  );
};

export default App;
