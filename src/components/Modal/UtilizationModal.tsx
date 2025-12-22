import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Station, ChartType } from '@/types';
import { stationUtils } from '@/utils/stationUtils';
import { utilizationUtils } from '@/utils/utilizationUtils';
import './UtilizationModal.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UtilizationModalProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
}

const UtilizationModal: React.FC<UtilizationModalProps> = ({ station, isOpen, onClose }) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(new Date());
      setCurrentMonth(new Date());
    }
  }, [isOpen]);

  if (!isOpen || !station) return null;

  const utilizationData = utilizationUtils.generateMockData(selectedDate, 'day');

  const chartData = {
    labels: utilizationData.labels,
    datasets: [
      {
        label: 'Utilization (%)',
        data: utilizationData.data,
        borderColor: '#DB333D',
        backgroundColor: 'rgba(219, 51, 61, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`,
        },
      },
    },
  };

  const ChartComponent = chartType === 'line' ? Line : Bar;

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days: JSX.Element[] = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="calendar-day other-month">
          {prevMonthLastDay - i}
        </div>
      );
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      
      const isToday = date.getTime() === today.getTime();
      const isSelected = date.getTime() === selectedDate.getTime();
      const isFuture = date > today;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isFuture ? 'disabled' : ''}`}
          onClick={() => !isFuture && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows x 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div key={`next-${day}`} className="calendar-day other-month">
          {day}
        </div>
      );
    }

    return days;
  };

  const canGoPrevMonth = () => {
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 3);
    minDate.setDate(1);
    return currentMonth >= minDate;
  };

  const canGoNextMonth = () => {
    const today = new Date();
    return currentMonth < today;
  };

  const handlePrevMonth = () => {
    if (canGoPrevMonth()) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (canGoNextMonth()) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Utilization: {stationUtils.getAddressLabel(station)}</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="chart-controls">
            <div className="control-group">
              <label>Select Date:</label>
              <div className="calendar-wrapper">
                <div className="calendar-container">
                  <div className="calendar-header">
                    <button
                      className={`calendar-nav ${!canGoPrevMonth() ? 'disabled' : ''}`}
                      onClick={handlePrevMonth}
                      disabled={!canGoPrevMonth()}
                    >
                      &larr;
                    </button>
                    <span id="currentMonthYear">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      className={`calendar-nav ${!canGoNextMonth() ? 'disabled' : ''}`}
                      onClick={handleNextMonth}
                      disabled={!canGoNextMonth()}
                    >
                      &rarr;
                    </button>
                  </div>
                  <div className="calendar-grid">
                    <div className="calendar-day-header">Mon</div>
                    <div className="calendar-day-header">Tue</div>
                    <div className="calendar-day-header">Wed</div>
                    <div className="calendar-day-header">Thu</div>
                    <div className="calendar-day-header">Fri</div>
                    <div className="calendar-day-header">Sat</div>
                    <div className="calendar-day-header">Sun</div>
                    <div className="calendar-days">{renderCalendar()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label>Chart Type:</label>
              <select value={chartType} onChange={(e) => setChartType(e.target.value as ChartType)}>
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
          </div>

          <div style={{ height: '300px', marginTop: '20px' }}>
            <ChartComponent data={chartData} options={chartOptions} />
          </div>

          <div className="utilization-stats">
            <div className="stat-item">
              <span className="stat-label">Average Utilization:</span>
              <span className="stat-value">{Math.round(utilizationData.average)}%</span>
            </div>
          </div>

          {utilizationData.capacityAlerts && utilizationData.capacityAlerts.length > 0 && (
            <div className="overload-events">
              <div className="overload-events-header">Capacity alerts</div>
              <div id="overloadEventsList">
                {utilizationData.capacityAlerts.map((alert, index) => (
                  <div key={index} className="overload-event">
                    <span>{alert.time}</span>
                    <strong>{alert.utilization}%</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UtilizationModal;
