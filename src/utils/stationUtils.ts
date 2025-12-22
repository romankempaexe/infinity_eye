import { Station, OccupancyLevel } from '@/types';
import { OCCUPANCY_THRESHOLDS } from '@/constants';

export const stationUtils = {
  ensureCapacity(station: Station): void {
    if (!station.capacity || station.capacity <= 0) {
      station.capacity = 20;
    }
    if (!Number.isFinite(station.bikes)) {
      station.bikes = Math.floor(Math.random() * station.capacity);
    }
    if (station.bikes > station.capacity) {
      station.bikes = station.capacity;
    }
  },

  getOccupancyRatio(station: Station): number {
    if (!station?.capacity) return 0;
    return Math.min(1, station.bikes / station.capacity);
  },

  getOccupancyClass(station: Station): OccupancyLevel {
    const ratio = this.getOccupancyRatio(station);
    if (ratio >= OCCUPANCY_THRESHOLDS.HIGH) return 'occupancy-high';
    if (ratio >= OCCUPANCY_THRESHOLDS.MEDIUM) return 'occupancy-medium';
    return 'occupancy-low';
  },

  getOccupancyPercent(station: Station): number {
    return Math.round(this.getOccupancyRatio(station) * 100);
  },

  getFreeSlots(station: Station): number {
    if (!station) return 0;
    const capacity = Number.isFinite(station.capacity) ? station.capacity : 0;
    const bikes = Number.isFinite(station.bikes) ? station.bikes : 0;
    return Math.max(0, capacity - bikes);
  },

  getOccupancyLabel(station: Station): string {
    const percent = this.getOccupancyPercent(station);
    return `${station.bikes}/${station.capacity} bikes (${percent}%)`;
  },

  formatCoordinates(coord: { lat: number; lng: number }): string {
    if (!coord) return '--';
    return `${coord.lat.toFixed(4)}°, ${coord.lng.toFixed(4)}°`;
  },

  getAddressLabel(station: Station): string {
    if (station?.address) return station.address;
    if (station?.center) return this.formatCoordinates(station.center);
    return 'Unknown address';
  },
};
