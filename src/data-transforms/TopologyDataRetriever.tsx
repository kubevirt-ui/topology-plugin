import { FC, useContext, useEffect, useMemo, useState } from 'react';

import {
  useK8sWatchResources,
  WatchK8sResources,
  WatchK8sResults,
} from '@openshift-console/dynamic-plugin-sdk';
import { observer } from '@patternfly/react-topology';
import { isEmpty } from '@topology-utils/common-utils';
import useDebounceCallback from '@topology-utils/hooks/useDebounceCallback';

import { TopologyResourcesObject, TrafficData } from '../utils/types/topology-types';

import { ExtensibleModel, ModelContext } from './ModelContext';
import { updateTopologyDataModel } from './updateTopologyDataModel';
import useMonitoringAlerts from './useMonitoringAlerts';

type TopologyDataRetrieverProps = {
  trafficData?: TrafficData;
};

const TopologyDataRetriever: FC<TopologyDataRetrieverProps> = ({ trafficData }) => {
  const dataModelContext = useContext<ExtensibleModel>(ModelContext);
  const { namespace, extensionsLoaded, watchedResources } = dataModelContext;
  const [resources, setResources] = useState<WatchK8sResults<TopologyResourcesObject>>();
  const monitoringAlerts = useMonitoringAlerts(namespace);
  const resourcesList = useMemo<WatchK8sResources<any>>(
    () => (namespace && extensionsLoaded ? watchedResources : {}),
    [extensionsLoaded, watchedResources, namespace],
  );

  const debouncedUpdateResources = useDebounceCallback(setResources, 250);

  const updatedResources = useK8sWatchResources<TopologyResourcesObject>(resourcesList);
  useEffect(
    () => debouncedUpdateResources(updatedResources),
    [debouncedUpdateResources, updatedResources],
  );

  // Wipe the current model on a namespace change
  useEffect(() => {
    dataModelContext.model = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);

  useEffect(() => {
    if (!isEmpty(resources)) {
      updateTopologyDataModel(dataModelContext, resources, trafficData, monitoringAlerts)
        .then((res) => {
          dataModelContext.loadError = res.loadError;
          if (res.loaded) {
            dataModelContext.loaded = true;
            dataModelContext.model = res.model;
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {});
    }
  }, [resources, trafficData, dataModelContext, monitoringAlerts]);

  return null;
};

export default observer(TopologyDataRetriever);
