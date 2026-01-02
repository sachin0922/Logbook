
export enum LogSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  SUCCESS = 'SUCCESS'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  engineer: string;
  unitId: string;
  phase: string;
  severity: LogSeverity;
  content: string;
  images?: string[]; // base64
  tags: string[];
}

export interface RigStatus {
  activeUnit: string;
  currentPhase: string;
  temperature: number;
  pressure: number;
  uptime: string;
}

export interface AIAnalysis {
  summary: string;
  anomalies: string[];
  recommendations: string[];
}
