import { Station } from '@/types';

const API_BASE = '';

export const stationService = {
  async loadStations(): Promise<Station[]> {
    try {
      const response = await fetch(`${API_BASE}/stations.json`);
      if (!response.ok) {
        throw new Error(`Failed to load stations: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error loading stations:', error);
      return [];
    }
  },

  async saveStations(stations: Station[]): Promise<void> {
    try {
      await fetch(`${API_BASE}/stations.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stations),
      });
    } catch (error) {
      console.error('Error saving stations:', error);
      throw error;
    }
  },

  exportStations(stations: Station[]): void {
    if (stations.length === 0) {
      alert('No stations to save.');
      return;
    }

    const payload = JSON.stringify(stations, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stations-${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async importStations(file: File): Promise<Station[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          
          if (!Array.isArray(parsed)) {
            throw new Error('Expected an array of stations.');
          }
          
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },
};
