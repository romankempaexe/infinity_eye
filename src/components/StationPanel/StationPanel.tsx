import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { stationUtils } from '@/utils/stationUtils';
import './StationPanel.css';

interface StationPanelProps {
  onStationFocus?: (stationId: number) => void;
  onUtilizationClick?: (stationId: number) => void;
  onDeleteStation?: (stationId: number) => void;
}

const StationPanel: React.FC<StationPanelProps> = ({
  onStationFocus,
  onUtilizationClick,
  onDeleteStation,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const stations = useAppStore((state) => state.stations);

  const filteredStations = stations.filter((station) => {
    const address = stationUtils.getAddressLabel(station).toLowerCase();
    return address.includes(searchTerm.toLowerCase());
  });

  const handleDelete = (stationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this station?')) {
      onDeleteStation?.(stationId);
    }
  };

  return (
    <div className={`station-panel collapsible-panel ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed && (
        <>
          <div className="panel-header">
            <div className="station-panel-title">Stations & status</div>
            <button
              className="collapse-toggle"
              type="button"
              aria-label="Toggle station list"
              onClick={() => setCollapsed(true)}
            >
              -
            </button>
          </div>

          <div className="panel-content">
            <div className="station-search">
              <input
                type="text"
                id="stationSearchInput"
                placeholder="Search by address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="station-list">
              {filteredStations.length === 0 ? (
                <p style={{ color: '#999', fontSize: '11px' }}>
                  {stations.length === 0 ? 'No stations yet' : 'No stations found'}
                </p>
              ) : (
                filteredStations.map((station) => {
                  const occupancyClass = stationUtils.getOccupancyClass(station);
                  const percent = stationUtils.getOccupancyPercent(station);
                  const freeSlots = stationUtils.getFreeSlots(station);
                  const coordinateLabel = station.center
                    ? stationUtils.formatCoordinates(station.center)
                    : 'Unknown coordinates';

                  return (
                    <div key={station.id} className={`station-item ${occupancyClass}`}>
                      <div
                        className="station-item-content"
                        onClick={() => onStationFocus?.(station.id)}
                      >
                        <strong>{stationUtils.getAddressLabel(station)}</strong>
                        <small>{coordinateLabel}</small>
                        <div
                          className="occupancy-progress"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={percent}
                        >
                          <div
                            className="occupancy-progress-fill"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="occupancy-progress-text">
                          {stationUtils.getOccupancyLabel(station)}
                        </span>
                        <span className="occupancy-free">Free slots: {freeSlots}</span>
                      </div>
                      <div className="station-item-buttons">
                        <button onClick={() => onUtilizationClick?.(station.id)}>
                          📊 Utilization
                        </button>
                        <button onClick={(e) => handleDelete(station.id, e)}>Delete</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {collapsed && (
        <button
          className="collapsed-icon"
          type="button"
          onClick={() => setCollapsed(false)}
          title="Show stations panel"
          aria-label="Show stations panel"
        >
          🚲
        </button>
      )}
    </div>
  );
};

export default StationPanel;
