import { UtilizationData, CapacityAlert } from '@/types';

export const utilizationUtils = {
  generateMockData(
    date: Date,
    timeRange: 'day' | 'week' | 'month' | 'year' = 'day'
  ): UtilizationData {
    const labels: string[] = [];
    const data: number[] = [];
    let peakHour = '';
    let maxUtilization = 0;
    let totalUtilization = 0;
    const capacityAlerts: CapacityAlert[] = [];

    switch (timeRange) {
      case 'day':
        for (let hour = 0; hour < 24; hour++) {
          labels.push(`${hour}:00`);
          const utilization = this.generateHourlyUtilization(hour);
          data.push(Math.round(utilization));
          
          if (utilization > maxUtilization) {
            maxUtilization = utilization;
            peakHour = `${hour}:00`;
          }
          
          if (utilization > 95) {
            capacityAlerts.push({
              time: `${hour}:00`,
              utilization: Math.round(utilization),
            });
          }
          
          totalUtilization += utilization;
        }
        break;

      case 'week':
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 0; i < 7; i++) {
          labels.push(days[i]);
          const utilization = 30 + Math.random() * 50;
          data.push(Math.round(utilization));
          
          if (utilization > maxUtilization) {
            maxUtilization = utilization;
            peakHour = days[i];
          }
          
          totalUtilization += utilization;
        }
        break;

      case 'month':
        for (let i = 1; i <= 30; i++) {
          labels.push(i.toString());
          const utilization = 25 + Math.random() * 60;
          data.push(Math.round(utilization));
          
          if (utilization > maxUtilization) {
            maxUtilization = utilization;
            peakHour = i.toString();
          }
          
          totalUtilization += utilization;
        }
        break;

      case 'year':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < 12; i++) {
          labels.push(months[i]);
          const utilization = 20 + Math.random() * 70;
          data.push(Math.round(utilization));
          
          if (utilization > maxUtilization) {
            maxUtilization = utilization;
            peakHour = months[i];
          }
          
          totalUtilization += utilization;
        }
        break;
    }

    return {
      labels,
      data,
      peakHours: peakHour,
      average: totalUtilization / data.length,
      capacityAlerts,
    };
  },

  generateHourlyUtilization(hour: number): number {
    let utilization: number;
    
    if (hour >= 7 && hour <= 9) {
      // Morning commute
      utilization = 70 + Math.random() * 25;
    } else if (hour >= 17 && hour <= 19) {
      // Evening commute
      utilization = 75 + Math.random() * 20;
    } else if (hour >= 10 && hour <= 16) {
      // Work hours
      utilization = 40 + Math.random() * 30;
    } else {
      // Off hours
      utilization = 10 + Math.random() * 20;
    }
    
    return Math.min(100, Math.max(0, utilization));
  },
};
