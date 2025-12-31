export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeSessions: number;
  requestsPerMinute: number;
  lastUpdated: Date;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  value2?: number;
}

export interface LogEntry {
  id: number;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
}

export enum ConnectionStatus {
  CONNECTED = 'متصل',
  DISCONNECTED = 'قطع ارتباط',
  CONNECTING = 'در حال اتصال...'
}