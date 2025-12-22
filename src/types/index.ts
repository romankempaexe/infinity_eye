export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Station {
  id: number;
  center: Coordinates;
  bikes: number;
  capacity: number;
  address?: string;
  addressRequested?: boolean;
}

export type OccupancyLevel = 'occupancy-low' | 'occupancy-medium' | 'occupancy-high';

export interface UtilizationData {
  labels: string[];
  data: number[];
  peakHours: string;
  average: number;
  capacityAlerts?: CapacityAlert[];
}

export interface CapacityAlert {
  time: string;
  utilization: number;
}

export type ChartType = 'line' | 'bar';
export type TimeRange = 'day' | 'week' | 'month' | 'year';

export interface CalendarDay {
  day: number;
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isOtherMonth: boolean;
  isDisabled: boolean;
  hasCapacityAlert: boolean;
}

export type BaseLayer = 'osm' | 'satellite' | 'dark';
