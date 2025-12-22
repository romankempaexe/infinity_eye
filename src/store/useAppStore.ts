import { create } from 'zustand';
import { Station, BaseLayer } from '@/types';

interface AppState {
  // Stations
  stations: Station[];
  focusedStationId: number | null;
  nextStationId: number;
  
  // Map state
  baseLayer: BaseLayer;
  showHeatmap: boolean;
  showStationMarkers: boolean;
  isDrawingMode: boolean;
  
  // Actions
  addStation: (station: Omit<Station, 'id'>) => number;
  updateStation: (id: number, updates: Partial<Station>) => void;
  deleteStation: (id: number) => void;
  setFocusedStation: (id: number | null) => void;
  setStations: (stations: Station[]) => void;
  
  setBaseLayer: (layer: BaseLayer) => void;
  toggleHeatmap: () => void;
  toggleStationMarkers: () => void;
  setDrawingMode: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  stations: [],
  focusedStationId: null,
  nextStationId: 1,
  baseLayer: 'osm',
  showHeatmap: false,
  showStationMarkers: true,
  isDrawingMode: false,

  // Actions
  addStation: (station) => {
    const newStationId = useAppStore.getState().nextStationId;
    set((state) => ({
      stations: [...state.stations, { ...station, id: state.nextStationId }],
      nextStationId: state.nextStationId + 1,
    }));
    return newStationId;
  },

  updateStation: (id, updates) =>
    set((state) => ({
      stations: state.stations.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  deleteStation: (id) =>
    set((state) => ({
      stations: state.stations.filter((s) => s.id !== id),
      focusedStationId: state.focusedStationId === id ? null : state.focusedStationId,
    })),

  setFocusedStation: (id) => set({ focusedStationId: id }),

  setStations: (stations) =>
    set((state) => {
      const maxId = stations.reduce((max, s) => Math.max(max, s.id), 0);
      return {
        stations,
        nextStationId: maxId + 1,
      };
    }),

  setBaseLayer: (layer) => set({ baseLayer: layer }),
  toggleHeatmap: () => set((state) => ({ showHeatmap: !state.showHeatmap })),
  toggleStationMarkers: () => set((state) => ({ showStationMarkers: !state.showStationMarkers })),
  setDrawingMode: (enabled) => set({ isDrawingMode: enabled }),
}));
