import { useEffect, useMemo, useState } from 'react';

import {
  CronJobModel,
  DaemonSetModel,
  DeploymentConfigModel,
  DeploymentModel,
  JobModel,
  PodModel,
  StatefulSetModel,
} from '@kubevirt-ui/kubevirt-api/console';
import {
  AdapterDataType,
  K8sResourceCommon,
  NetworkAdapterType,
  PodsAdapterDataType,
  ResolvedExtension,
  useK8sWatchResources,
} from '@openshift-console/dynamic-plugin-sdk';
import { BuildConfigData } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { Extension } from '@openshift-console/dynamic-plugin-sdk/lib/types';
import { GraphElement } from '@patternfly/react-topology';
import { useBuildConfigsWatcher } from '@topology-utils/hooks/useBuildsConfigWatcher/useBuildsConfigWatcher';
import usePodsWatcher from '@topology-utils/hooks/usePodsWatcher/usePodsWatcher';
import { getResourcesToWatchForPods } from '@topology-utils/hooks/usePodsWatcher/utils/utils';
import { getPodsForResource } from '@topology-utils/resource-utils';

import { getResource } from '../../utils';

import useJobsForCronJobWatcher from './JobsTabSection/hooks/useJobsForCronJobWatcher';

export const getDataFromAdapter = <T extends { resource: K8sResourceCommon }, E extends Extension>(
  element: GraphElement,
  [resolvedExtensions, loaded]: [ResolvedExtension<E>[], boolean],
): T | undefined =>
  loaded
    ? resolvedExtensions.reduce<T>((acc, { properties: { adapt } }) => {
        const values = (adapt as (element: GraphElement) => T)(element);
        return values ?? acc;
      }, undefined)
    : undefined;

const usePodsAdapterForWorkloads = (resource: K8sResourceCommon): PodsAdapterDataType => {
  const buildConfigData = useBuildConfigsWatcher(resource);
  const { podData, loaded, loadError } = usePodsWatcher(resource);
  return useMemo(
    () => ({ pods: podData?.pods, loaded, loadError, buildConfigData }),
    [buildConfigData, loadError, loaded, podData],
  );
};

export const podsAdapterForWorkloads = (
  element: GraphElement,
): AdapterDataType<PodsAdapterDataType> | undefined => {
  const resource = getResource(element);
  if (!resource) {
    return undefined;
  }
  if (
    !resource ||
    ![
      DeploymentConfigModel.kind,
      DeploymentModel.kind,
      DaemonSetModel.kind,
      StatefulSetModel.kind,
      JobModel.kind,
      PodModel.kind,
    ].includes(resource.kind)
  )
    return undefined;
  return { resource, provider: usePodsAdapterForWorkloads };
};

export const buildsAdapterForWorkloads = (
  element: GraphElement,
): AdapterDataType<BuildConfigData> | undefined => {
  const resource = getResource(element);
  if (!resource) {
    return undefined;
  }
  if (
    !resource ||
    ![
      DeploymentConfigModel.kind,
      DeploymentModel.kind,
      DaemonSetModel.kind,
      StatefulSetModel.kind,
      CronJobModel.kind,
    ].includes(resource.kind)
  )
    return undefined;
  return { resource, provider: useBuildConfigsWatcher };
};

export const networkAdapterForWorkloads = (
  element: GraphElement,
): NetworkAdapterType | undefined => {
  const resource = getResource(element);
  if (!resource) {
    return undefined;
  }
  if (
    !resource ||
    ![
      DeploymentConfigModel.kind,
      DeploymentModel.kind,
      DaemonSetModel.kind,
      StatefulSetModel.kind,
      PodModel.kind,
    ].includes(resource.kind)
  )
    return undefined;
  return { resource };
};

const usePodsAdapterForCronJobWorkloads = (resource: K8sResourceCommon): PodsAdapterDataType => {
  const { jobs } = useJobsForCronJobWatcher(resource);
  const {
    metadata: { namespace },
  } = resource;

  const [pods, setPods] = useState([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');
  const watchedResources = useMemo(
    () => getResourcesToWatchForPods('CronJob', namespace),
    [namespace],
  );

  const resources = useK8sWatchResources(watchedResources);

  useEffect(() => {
    const errorKey = Object.keys(resources).find((key) => resources[key].loadError);
    if (errorKey) {
      setLoadError(resources[errorKey].loadError);
      return;
    }
    setLoadError('');
    if (
      Object.keys(resources).length > 0 &&
      Object.keys(resources).every((key) => resources[key].loaded)
    ) {
      const updatedPods = jobs?.length
        ? jobs.reduce((acc, res) => {
            acc.push(...getPodsForResource(res, resources));
            return acc;
          }, [])
        : [];
      setPods(updatedPods);
      setLoaded(true);
    }
  }, [jobs, resources]);
  return { pods, loaded, loadError };
};

export const podsAdapterForCronJobWorkload = (
  element: GraphElement,
): AdapterDataType<PodsAdapterDataType> | undefined => {
  const resource = getResource(element);
  if (!resource || resource.kind !== CronJobModel.kind) return undefined;
  return { resource, provider: usePodsAdapterForCronJobWorkloads };
};
