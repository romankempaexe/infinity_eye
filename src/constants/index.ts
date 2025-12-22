export const PRIMARY_COLOR = '#DB333D';
export const PRIMARY_DARK = '#b3252c';
export const PRIMARY_SOFT = 'rgba(219, 51, 61, 0.12)';
export const PRIMARY_CONTRAST = '#ffffff';

export const DEFAULT_PROGRESS_GRADIENT = `linear-gradient(90deg,
  #27ae60 0%,
  #2ecc71 20%,
  #f1c40f 50%,
  #e67e22 80%,
  #c0392b 100%)`;

export const OCCUPANCY_THRESHOLDS = {
  HIGH: 0.85,
  MEDIUM: 0.6,
} as const;

export const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';
export const NOMINATIM_PARAMS = 'format=json&addressdetails=1';

export const DEFAULT_MAP_CENTER: [number, number] = [48.1486, 17.1077]; // Bratislava
export const DEFAULT_MAP_ZOOM = 13;
export const MIN_ZOOM = 3;
export const MAX_ZOOM = 19;

export const REVERSE_GEOCODE_DELAY = 800; // ms between requests

export const TILE_LAYERS = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB',
  },
} as const;
