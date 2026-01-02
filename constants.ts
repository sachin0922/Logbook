
import { LogEntry, LogSeverity } from './types';

export const TEST_PHASES = [
  'Initialization',
  'Thermal Stress',
  'Vibration Analysis',
  'Load Balancing',
  'Pressure Test',
  'Final Calibration'
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    engineer: 'Sarah Chen',
    unitId: 'RX-700-B',
    phase: 'Thermal Stress',
    severity: LogSeverity.INFO,
    content: 'Initial temperature readings stabilized at 45C. No leakage observed in primary manifold.',
    tags: ['baseline', 'temperature']
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    engineer: 'Sarah Chen',
    unitId: 'RX-700-B',
    phase: 'Vibration Analysis',
    severity: LogSeverity.WARNING,
    content: 'Unusual acoustic profile detected at 4000 RPM. Resonance in housing bracket possible.',
    tags: ['vibration', 'bracket']
  }
];
