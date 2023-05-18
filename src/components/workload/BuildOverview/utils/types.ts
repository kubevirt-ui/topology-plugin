export enum BuildPhase {
  Cancelled = 'Cancelled',
  Complete = 'Complete',
  Error = 'Error',
  Failed = 'Failed',
  New = 'New',
  Pending = 'Pending',
  Running = 'Running',
}

export enum BuildStrategyType {
  Docker = 'Docker',
  Devfile = 'Devfile',
  Custom = 'Custom',
  JenkinsPipeline = 'JenkinsPipeline',
  Source = 'Source',
}
