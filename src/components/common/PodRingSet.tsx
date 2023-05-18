import React, { FC, useMemo } from 'react';

import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { Bullseye, Split, SplitItem } from '@patternfly/react-core';
import { LongArrowAltRightIcon } from '@patternfly/react-icons';
import { global_Color_200 as color200 } from '@patternfly/react-tokens/dist/js/global_Color_200';
import usePodsWatcher from '@topology-utils/hooks/usePodsWatcher/usePodsWatcher';
import { getPodData } from '@topology-utils/pod-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import LoadingInline from './LoadingInline/LoadingInline';
import PodRing from './PodRing/PodRing';

interface PodRingSetProps {
  obj: K8sResourceKind;
  path: string;
  impersonate?: string;
}

const PodRingSet: FC<PodRingSetProps> = ({ obj, path }) => {
  const { podData, loadError, loaded } = usePodsWatcher(obj);
  const resourceKind = getK8sModel(obj);

  const deploymentData = useMemo(() => {
    return loaded && !loadError
      ? getPodData({ ...podData, obj })
      : { inProgressDeploymentData: null, completedDeploymentData: null };
  }, [loadError, loaded, podData, obj]);

  const current = podData?.current && podData?.current.obj;
  const previous = podData?.previous && podData?.previous.obj;
  const { inProgressDeploymentData, completedDeploymentData } = deploymentData;
  const progressRC = inProgressDeploymentData && current;
  const completedRC = !!inProgressDeploymentData && completedDeploymentData ? previous : current;

  return loaded ? (
    <Split hasGutter>
      <SplitItem>
        <PodRing
          key={inProgressDeploymentData ? 'deploy' : 'notDeploy'}
          pods={completedDeploymentData}
          rc={podData?.isRollingOut ? completedRC : podData?.current?.obj}
          resourceKind={resourceKind}
          obj={obj}
          path={path}
          enableScaling={!podData?.isRollingOut}
        />
      </SplitItem>
      {inProgressDeploymentData && (
        <>
          <SplitItem>
            <Bullseye>
              <LongArrowAltRightIcon size="xl" color={color200.value} />
            </Bullseye>
          </SplitItem>
          <SplitItem>
            <PodRing
              pods={inProgressDeploymentData}
              rc={progressRC}
              resourceKind={resourceKind}
              obj={obj}
              path={path}
              enableScaling={false}
            />
          </SplitItem>
        </>
      )}
    </Split>
  ) : (
    <LoadingInline />
  );
};

export default PodRingSet;
