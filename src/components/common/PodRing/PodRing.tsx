import React, { FC, useEffect, useState } from 'react';

import { K8sKind, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import { ImpersonateKind } from '@openshift-console/dynamic-plugin-sdk/lib/app/redux-types';
import { Bullseye, Button, Split, SplitItem } from '@patternfly/react-core';
import { AngleDownIcon, AngleUpIcon } from '@patternfly/react-icons';
import { debounce } from '@topology-utils/debounce';
import usePodRingLabel from '@topology-utils/hooks/usePodRingLabel/usePodRingLabel';
import useRelatedHPA from '@topology-utils/hooks/useRelatedHPA/useRelatedHPA';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { ExtPodKind } from '@topology-utils/types/podTypes';

import PodStatus from '../../graph-view/components/nodes/PodStatus/PodStatus';

import usePodScalingAccessStatus from './utils/hooks/usePodScalingAccessStatus';

interface PodRingProps {
  pods: ExtPodKind[];
  obj: K8sResourceKind;
  rc?: K8sResourceKind;
  resourceKind: K8sKind;
  path?: string;
  impersonate?: ImpersonateKind;
  enableScaling?: boolean;
}

const PodRing: FC<PodRingProps> = ({
  pods,
  obj,
  resourceKind,
  path,
  impersonate,
  rc,
  enableScaling = true,
}) => {
  const [clickCount, setClickCount] = useState(obj.spec.replicas);
  const { t } = useTopologyTranslation();
  const isAccessScalingAllowed = usePodScalingAccessStatus(
    obj,
    resourceKind,
    pods,
    enableScaling,
    impersonate,
  );

  useEffect(
    () => {
      if (clickCount !== obj.spec.replicas) {
        setClickCount(obj.spec.replicas);
      }
    },
    // disabling exhaustive-deps because I do not want to add clickCount to
    // dependency array. I only want to trigger useEffect when `obj.spec.replicas` changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [obj.spec.replicas],
  );

  const handleScaling = debounce(
    (operation: number) => {
      const patch = [{ op: 'replace', path, value: operation }];
      const opts = { path: 'scale' };
      const promise: Promise<K8sResourceKind> = k8sPatch({
        model: resourceKind,
        resource: obj,
        data: patch,
        queryParams: opts,
      });
      promise.catch((error) => {
        throw error;
      });
    },
    1000,
    true,
  );

  const handleClick = (operation: number) => {
    setClickCount(clickCount + operation);
    handleScaling(clickCount + operation);
  };

  const {
    apiVersion,
    kind,
    metadata: { name, namespace },
  } = obj;
  const [hpa] = useRelatedHPA(apiVersion, kind, name, namespace);
  const hpaControlledScaling = !!hpa;

  const isScalingAllowed = isAccessScalingAllowed && !hpaControlledScaling;

  const resourceObj = rc || obj;
  const { title, subTitle, titleComponent } = usePodRingLabel(
    resourceObj,
    kind,
    pods,
    hpaControlledScaling,
    hpa,
  );

  return (
    <Split>
      <SplitItem>
        <div className="odc-pod-ring">
          <PodStatus
            standalone
            data={pods}
            subTitle={subTitle}
            title={title}
            titleComponent={titleComponent}
          />
        </div>
      </SplitItem>
      {isScalingAllowed && (
        <SplitItem>
          <Bullseye>
            <div>
              <Button
                type="button"
                variant="plain"
                aria-label={t('Increase the Pod count')}
                title={t('Increase the Pod count')}
                onClick={() => handleClick(1)}
                isBlock
              >
                <AngleUpIcon style={{ fontSize: '20' }} />
              </Button>
              <Button
                type="button"
                variant="plain"
                aria-label={t('Decrease the Pod count')}
                title={t('Decrease the Pod count')}
                onClick={() => handleClick(-1)}
                isBlock
                isDisabled={clickCount <= 0}
              >
                <AngleDownIcon style={{ fontSize: '20' }} />
              </Button>
            </div>
          </Bullseye>
        </SplitItem>
      )}
    </Split>
  );
};

export default PodRing;
