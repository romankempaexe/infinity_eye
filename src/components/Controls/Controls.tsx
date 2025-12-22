import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { geocodingService } from '@/services/geocodingService';
import { BaseLayer, Coordinates } from '@/types';
import './Controls.css';

interface ControlsProps {
  onZoomToHome?: () => void;
  onZoomToLocation?: () => void;
  onSearchLocation?: (coords: Coordinates, zoom?: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ onZoomToHome, onZoomToLocation, onSearchLocation }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const baseLayer = useAppStore((state) => state.baseLayer);
  const showHeatmap = useAppStore((state) => state.showHeatmap);
  const setBaseLayer = useAppStore((state) => state.setBaseLayer);
  const toggleHeatmap = useAppStore((state) => state.toggleHeatmap);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await geocodingService.searchLocation(searchInput);
      if (result) {
        onSearchLocation?.(result, 13);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`controls-container collapsible-panel ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed && (
        <>
          <div className="panel-header">
            <span className="panel-title">Map Controls</span>
            <button
              className="collapse-toggle"
              type="button"
              aria-label="Toggle map controls"
              onClick={() => setCollapsed(true)}
            >
              -
            </button>
          </div>

          <div className="panel-content">
            {/* Search Section */}
            <div className="control-section collapsible-panel">
              <div className="panel-header">
                <label htmlFor="searchInput">Search location:</label>
              </div>
              <div className="panel-content">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="e.g. Bratislava"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSearching}
                />
                <button
                  className="btn-primary search-button"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Base Layer Selection */}
            <div className="control-section">
              <label>Base Layer:</label>
              <select
                value={baseLayer}
                onChange={(e) => setBaseLayer(e.target.value as BaseLayer)}
              >
                <option value="osm">OpenStreetMap</option>
                <option value="satellite">Satellite</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            {/* Layer Controls */}
            <div className="control-section">
              <label>Layers:</label>
              <div className="layer-control">
                <button
                  className={`layer-btn btn-secondary ${showHeatmap ? 'active' : ''}`}
                  onClick={toggleHeatmap}
                >
                  {showHeatmap ? '🔥 Hide Heatmap' : '🔥 Show Heatmap'}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="control-section">
              <label>Quick Actions:</label>
              <div className="button-group">
                <button className="btn-secondary" onClick={onZoomToHome}>
                  🏠 Home
                </button>
                <button className="btn-secondary" onClick={onZoomToLocation}>
                  📍 My Location
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {collapsed && (
        <button
          className="collapsed-icon"
          type="button"
          onClick={() => setCollapsed(false)}
          title="Show map controls"
          aria-label="Show map controls"
        >
          ⚙️
        </button>
      )}
    </div>
  );
};

export default Controls;
