import { useCallback } from 'react';

import {
  isTelemetryListener,
  TelemetryEventListener,
  TelemetryListener,
  useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';

import { getClusterType, getConsoleVersion } from './utils/utils';

const useTelemetry = () => {
  // TODO use useDynamicPluginInfo() hook to tell whether all dynamic plugins have been processed
  // to avoid firing telemetry events multiple times whenever a dynamic plugin loads asynchronously
  const [extensions] = useResolvedExtensions<TelemetryListener>(isTelemetryListener);

  const consoleVersion = getConsoleVersion();
  const clusterType = getClusterType();

  return useCallback<TelemetryEventListener>(
    (eventType, properties) => {
      extensions.forEach((e) =>
        e.properties.listener(eventType, {
          consoleVersion,
          clusterType,
          ...properties,
        }),
      );
    },
    [extensions], // eslint-disable-line react-hooks/exhaustive-deps
  );
};

export default useTelemetry;
