import React, { FC } from 'react';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { DeploymentKind } from '@topology-utils/types/commonTypes';

import DetailsItem from '../DetailsItem/DetailsItem';
import PodDisruptionBudgetField from '../PodDisruptionBudgetField/PodDisruptionBudgetField';

import RuntimeClass from './components/RuntimeClass';

type DeploymentDetailsListProps = {
  deployment: DeploymentKind;
};

const DeploymentDetailsList: FC<DeploymentDetailsListProps> = ({ deployment }) => {
  const { t } = useTopologyTranslation();
  return (
    <dl className="co-m-pane__details">
      <DetailsItem label={t('Update strategy')} obj={deployment} path="spec.strategy.type" />
      {deployment.spec.strategy.type === 'RollingUpdate' && (
        <>
          <DetailsItem
            label={t('Max unavailable')}
            obj={deployment}
            path="spec.strategy.rollingUpdate.maxUnavailable"
          >
            {t('{{maxUnavailable}} of {{count}} pod', {
              maxUnavailable: deployment.spec.strategy.rollingUpdate.maxUnavailable ?? 1,
              count: deployment.spec.replicas,
            })}
          </DetailsItem>
          <DetailsItem
            label={t('Max surge')}
            obj={deployment}
            path="spec.strategy.rollingUpdate.maxSurge"
          >
            {t('{{maxSurge}} greater than {{count}} pod', {
              maxSurge: deployment.spec.strategy.rollingUpdate.maxSurge ?? 1,
              count: deployment.spec.replicas,
            })}
          </DetailsItem>
        </>
      )}
      <DetailsItem
        label={t('Progress deadline seconds')}
        obj={deployment}
        path="spec.progressDeadlineSeconds"
      >
        {deployment.spec.progressDeadlineSeconds
          ? t('{{count}} second', { count: deployment.spec.progressDeadlineSeconds })
          : t('Not configured')}
      </DetailsItem>
      <DetailsItem label={t('Min ready seconds')} obj={deployment} path="spec.minReadySeconds">
        {deployment.spec.minReadySeconds
          ? t('{{count}} second', { count: deployment.spec.minReadySeconds })
          : t('Not configured')}
      </DetailsItem>
      <RuntimeClass obj={deployment} />
      <PodDisruptionBudgetField obj={deployment} />
    </dl>
  );
};

export default DeploymentDetailsList;
