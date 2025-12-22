import { useState, useCallback } from 'react';
import { geocodingService } from '@/services/geocodingService';
import { REVERSE_GEOCODE_DELAY } from '@/constants';
import { Station } from '@/types';

interface QueueItem {
  station: Station;
  force: boolean;
}

export const useGeocoding = (updateStation: (id: number, updates: Partial<Station>) => void) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const needsAddress = (station: Station, force: boolean) => {
    return force || !station.address || /°/.test(station.address);
  };

  const reverseGeocodeStation = useCallback((station: Station, force = false) => {
    if (!station?.center) return;
    if (!needsAddress(station, force) || station.addressRequested) return;

    updateStation(station.id, { addressRequested: true });
    setQueue(prev => [...prev, { station, force }]);
  }, [updateStation]);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    const item = queue[0];
    setQueue(prev => prev.slice(1));

    if (!item.station?.center) {
      updateStation(item.station.id, { addressRequested: false });
      return;
    }

    setIsProcessing(true);

    try {
      const address = await geocodingService.reverseGeocode(
        item.station.center.lat,
        item.station.center.lng
      );

      updateStation(item.station.id, {
        address: address || `${item.station.center.lat.toFixed(4)}°, ${item.station.center.lng.toFixed(4)}°`,
        addressRequested: false,
      });
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      updateStation(item.station.id, {
        address: `${item.station.center.lat.toFixed(4)}°, ${item.station.center.lng.toFixed(4)}°`,
        addressRequested: false,
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        if (queue.length > 1) {
          processQueue();
        }
      }, REVERSE_GEOCODE_DELAY);
    }
  }, [isProcessing, queue, updateStation]);

  // Auto-process queue
  if (queue.length > 0 && !isProcessing) {
    processQueue();
  }

  return { reverseGeocodeStation };
};
