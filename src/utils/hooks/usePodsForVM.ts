import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { VirtualMachineInstanceModelGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console/models/VirtualMachineInstanceModel';
import { K8sResourceCommon, useK8sWatchResources } from '@openshift-console/dynamic-plugin-sdk';
import { useDeepCompareMemoize } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useDeepCompareMemoize';
import { getReplicationControllersForResource } from '@topology-utils';
import useDebounceCallback from '@topology-utils/hooks/useDebounceCallback';
import { findVMIPod } from '@topology-utils/kubevirt-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { VMIKind } from '@topology-utils/types/kubevirtTypes';
import { PodKind, PodRCData } from '@topology-utils/types/podTypes';

const usePodsForVM = (
  vm: K8sResourceKind,
): { loaded: boolean; loadError: string; podData: PodRCData } => {
  const { namespace } = vm.metadata;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');
  const [podData, setPodData] = useState<PodRCData>();
  const vmName = vm.metadata.name;
  const vmRef = useRef<K8sResourceKind>(vm);

  const watchedResources = useMemo(
    () => ({
      replicationControllers: {
        isList: true,
        kind: 'ReplicationController',
        namespace,
      },
      pods: {
        isList: true,
        kind: 'Pod',
        namespace,
      },
      virtualmachineinstances: {
        isList: true,
        groupVersionKind: VirtualMachineInstanceModelGroupVersionKind,
        namespace,
        optional: true,
      },
    }),
    [namespace],
  );

  const resources = useK8sWatchResources<{ [key: string]: K8sResourceCommon[] }>(watchedResources);

  const updateResults = useCallback(
    (updatedResources) => {
      const errorKey = Object.keys(updatedResources).find((key) => updatedResources[key].loadError);
      if (errorKey) {
        setLoadError(updatedResources[errorKey].loadError);
        return;
      }
      if (
        Object.keys(updatedResources).length > 0 &&
        Object.keys(updatedResources).every((key) => updatedResources[key].loaded)
      ) {
        const vmis = updatedResources.virtualmachineinstances.data;
        const vmi = vmis.find((instance) => instance.metadata.name === vmName) as VMIKind;
        const { visibleReplicationControllers } = getReplicationControllersForResource(
          vmRef.current,
          updatedResources,
        );
        const [current, previous] = visibleReplicationControllers;
        const launcherPod = findVMIPod(vmi, updatedResources.pods.data as PodKind[]);
        const podRCData: PodRCData = {
          current,
          previous,
          isRollingOut: false,
          pods: launcherPod ? [launcherPod] : [],
          obj: vm,
        };
        setLoaded(true);
        setLoadError(null);
        setPodData(podRCData);
      }
    },
    // Don't update on a resource change, we want the debounce callback to be consistent
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vmName],
  );

  const debouncedUpdateResources = useDebounceCallback(updateResults, 250);

  useEffect(() => {
    debouncedUpdateResources(resources);
  }, [debouncedUpdateResources, resources]);

  return useDeepCompareMemoize({ loaded, loadError, podData });
};

export default usePodsForVM;
