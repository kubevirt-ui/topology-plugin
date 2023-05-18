import React from 'react';
import DetailsItem from 'src/components/common/DetailsItem/DetailsItem';
import PodDisruptionBudgetField from 'src/components/common/PodDisruptionBudgetField/PodDisruptionBudgetField';

import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { getRestartPolicyLabel } from '@topology-utils/pod-utils';
import { PodKind } from '@topology-utils/types/podTypes';

import RuntimeClass from '../../common/DeploymentDetailsList/components/RuntimeClass';
import PodTraffic from '../../common/PodTraffic';
import NodeLink from '../../metal3/NodeLink';

import PodStatus from './components/PodStatus';

export type PodDetailsListProps = {
  pod: PodKind;
};

const PodDetailsList: React.FC<PodDetailsListProps> = ({ pod }) => {
  const { t } = useTopologyTranslation();
  return (
    <dl className="co-m-pane__details">
      <dt>{t('Status')}</dt>
      <dd>
        <PodStatus pod={pod} />
      </dd>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <DetailsItem label={t('Restart policy')} obj={pod} path="spec.restartPolicy">
        {getRestartPolicyLabel(pod)}
      </DetailsItem>
      <DetailsItem label={t('Active deadline seconds')} obj={pod} path="spec.activeDeadlineSeconds">
        {pod.spec.activeDeadlineSeconds
          ? t('{{count}} second', { count: pod.spec.activeDeadlineSeconds })
          : t('Not configured')}
      </DetailsItem>
      <DetailsItem label={t('Pod IP')} obj={pod} path="status.podIP" />
      <DetailsItem label={t('Host IP')} obj={pod} path="status.hostIP" />
      <DetailsItem label={t('Node')} obj={pod} path="spec.nodeName" hideEmpty>
        <NodeLink name={pod.spec.nodeName} />
      </DetailsItem>
      {pod.spec.imagePullSecrets && (
        <DetailsItem label={t('Image pull secret')} obj={pod} path="spec.imagePullSecrets">
          {pod.spec.imagePullSecrets.map((imagePullSecret) => (
            <ResourceLink
              key={imagePullSecret.name}
              kind="Secret"
              name={imagePullSecret.name}
              namespace={pod.metadata.namespace}
            />
          ))}
        </DetailsItem>
      )}
      <RuntimeClass obj={pod} path="spec.runtimeClassName" />
      <PodDisruptionBudgetField obj={pod} />
      <DetailsItem label={t('Receiving Traffic')} obj={pod}>
        <PodTraffic podName={pod.metadata.name} namespace={pod.metadata.namespace} />
      </DetailsItem>
    </dl>
  );
};

export default PodDetailsList;
