import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { useAppStore } from '@/store/useAppStore';
import { stationUtils } from '@/utils/stationUtils';

const HeatmapLayer: React.FC = () => {
  const map = useMap();
  const stations = useAppStore((state) => state.stations);
  const heatLayerRef = React.useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Create new heat layer
    const heatData = stations
      .filter((s) => s.center)
      .map((s) => {
        const occupancyRatio = stationUtils.getOccupancyRatio(s);
        return [s.center.lat, s.center.lng, occupancyRatio] as [number, number, number];
      });

    if (heatData.length > 0) {
      heatLayerRef.current = (L as any).heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.0: '#27ae60',
          0.5: '#f1c40f',
          0.7: '#e67e22',
          1.0: '#c0392b',
        },
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, stations]);

  return null;
};

export default HeatmapLayer;
