import React from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TILE_LAYERS, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, MIN_ZOOM, MAX_ZOOM } from '@/constants';
import { BaseLayer } from '@/types';
import StationMarkers from './StationMarkers';
import HeatmapLayer from './HeatmapLayer';
import { useAppStore } from '@/store/useAppStore';

interface MapComponentProps {
  onMapClick?: (latlng: LatLng) => void;
  mapRef?: React.MutableRefObject<L.Map | null>;
  onStationClick?: (stationId: number) => void;
  onUtilizationClick?: (stationId: number) => void;
}

const MapEventHandler: React.FC<{ onMapClick?: (latlng: LatLng) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const MapRefSetter: React.FC<{ mapRef?: React.MutableRefObject<L.Map | null> }> = ({ mapRef }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);

  return null;
};

const BaseLayerController: React.FC<{ layer: BaseLayer }> = ({ layer }) => {
  const map = useMap();
  
  React.useEffect(() => {
    map.invalidateSize();
  }, [map]);

  return (
    <TileLayer
      key={layer}
      url={TILE_LAYERS[layer].url}
      attribution={TILE_LAYERS[layer].attribution}
      maxZoom={MAX_ZOOM}
    />
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ onMapClick, mapRef, onStationClick, onUtilizationClick }) => {
  const baseLayer = useAppStore((state) => state.baseLayer);
  const showHeatmap = useAppStore((state) => state.showHeatmap);
  const showStationMarkers = useAppStore((state) => state.showStationMarkers);

  return (
    <MapContainer
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      style={{ height: '100vh', width: '100%', zIndex: 1 }}
      zoomControl={true}
    >
      <BaseLayerController layer={baseLayer} />
      <MapEventHandler onMapClick={onMapClick} />
      <MapRefSetter mapRef={mapRef} />
      
      {showHeatmap && <HeatmapLayer />}
      {showStationMarkers && <StationMarkers onStationClick={onStationClick} onUtilizationClick={onUtilizationClick} />}
    </MapContainer>
  );
};

export default MapComponent;
