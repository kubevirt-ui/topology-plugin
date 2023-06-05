import { DEV_SANDBOX, OSD } from './const';

export const getConsoleVersion = () => (window as any).SERVER_FLAGS?.consoleVersion;
export const getClusterType = () => {
  if (
    (window as any).SERVER_FLAGS?.telemetry?.CLUSTER_TYPE === OSD &&
    (window as any).SERVER_FLAGS?.telemetry?.DEVSANDBOX === 'true'
  ) {
    return DEV_SANDBOX;
  }
  return (window as any).SERVER_FLAGS?.telemetry?.CLUSTER_TYPE;
};
