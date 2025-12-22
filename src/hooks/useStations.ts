import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { stationService } from '@/services/stationService';
import { stationUtils } from '@/utils/stationUtils';

export const useStations = () => {
  const { stations, setStations, addStation, updateStation, deleteStation } = useAppStore();

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    if (stations.length > 0) {
      stationService.saveStations(stations).catch(console.error);
    }
  }, [stations]);

  const loadStations = async () => {
    const loadedStations = await stationService.loadStations();
    loadedStations.forEach(stationUtils.ensureCapacity);
    setStations(loadedStations);
  };

  const handleAddStation = (station: Omit<import('@/types').Station, 'id'>) => {
    const newStation = { ...station };
    stationUtils.ensureCapacity(newStation as import('@/types').Station);
    return addStation(newStation);
  };

  const handleImportStations = async (file: File) => {
    try {
      const imported = await stationService.importStations(file);
      imported.forEach(stationUtils.ensureCapacity);
      setStations(imported);
      alert('Stations loaded from file.');
    } catch (error) {
      console.error('Error loading station file:', error);
      alert('Failed to load station file. Check the JSON format.');
    }
  };

  const handleExportStations = () => {
    stationService.exportStations(stations);
  };

  return {
    stations,
    addStation: handleAddStation,
    updateStation,
    deleteStation,
    importStations: handleImportStations,
    exportStations: handleExportStations,
    refreshStations: loadStations,
  };
};
