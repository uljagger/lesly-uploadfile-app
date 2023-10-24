import { SelectableValue } from '@grafana/data';
import pluginJson from './plugin.json';

export const PLUGIN_BASE_URL = `/a/${pluginJson.id}`;

export enum ROUTES {
  One = 'one',
  Two = 'two',
  Three = 'three',
  Four = 'four',
}



export const INFLUX_DATABASES: Array<SelectableValue<string>> = [
  {label: 'RAW DATA', value: 'rawdatas'},
  {label: 'ALGORITHM ANALYSIS', value: 'monitoring'},
  {label: 'MONITORING ', value: 'monitoring-dts'},
  {label: 'ALERTS ', value: 'alerts'},
  {label: 'PROCESS ', value: 'process'},
  {label: 'INFLUENCE ', value: 'influence'},
  {label: 'LEARNING ', value: 'learning'},
  {label: 'TRANSITION ', value: 'transition'}
];

export const FILE_TYPES: Array<SelectableValue<string>> = [
  {label: 'CSV FILE', value: 'csv'},
  {label: 'LESLY FUNCTION', value: 'jar'},
  {label: 'LESLY MODEL', value: 'zip'}
];

export const REGEX_IP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


