import React, { FC } from 'react';
import get from 'lodash.get';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import RuntimeClass from './DeploymentDetailsList/components/RuntimeClass';
import DetailsItem from './DetailsItem/DetailsItem';
import PodDisruptionBudgetField from './PodDisruptionBudgetField/PodDisruptionBudgetField';

type DeploymentConfigDetailsListProps = {
  dc: any;
};

const DeploymentConfigDetailsList: FC<DeploymentConfigDetailsListProps> = ({ dc }) => {
  const { t } = useTopologyTranslation();
  const timeout = get(dc, 'spec.strategy.rollingParams.timeoutSeconds');
  const updatePeriod = get(dc, 'spec.strategy.rollingParams.updatePeriodSeconds');
  const interval = get(dc, 'spec.strategy.rollingParams.intervalSeconds');
  const triggers = dc.spec.triggers
    ?.reduce((acc, trigger) => acc.push(trigger?.type), [])
    .join(', ');
  return (
    <dl className="co-m-pane__details">
      <DetailsItem label={t('Latest version')} obj={dc} path="status.latestVersion" />
      <DetailsItem label={t('Message')} obj={dc} path="status.details.message" hideEmpty />
      <DetailsItem label={t('Update strategy')} obj={dc} path="spec.strategy.type" />
      {dc.spec.strategy.type === 'Rolling' && (
        <>
          <DetailsItem
            label={t('Timeout')}
            obj={dc}
            path="spec.strategy.rollingParams.timeoutSeconds"
            hideEmpty
          >
            {t('{{count}} second', { count: timeout })}
          </DetailsItem>
          <DetailsItem
            label={t('Update period')}
            obj={dc}
            path="spec.strategy.rollingParams.updatePeriodSeconds"
            hideEmpty
          >
            {t('{{count}} second', { count: updatePeriod })}
          </DetailsItem>
          <DetailsItem
            label={t('Interval')}
            obj={dc}
            path="spec.strategy.rollingParams.intervalSeconds"
            hideEmpty
          >
            {t('{{count}} second', { count: interval })}
          </DetailsItem>
          <DetailsItem
            label={t('Max unavailable')}
            obj={dc}
            path="spec.strategy.rollingParams.maxUnavailable"
          >
            {t('{{maxUnavailable}} of {{count}} pod', {
              maxUnavailable: dc.spec.strategy.rollingParams.maxUnavailable ?? 1,
              count: dc.spec.replicas,
            })}
          </DetailsItem>
          <DetailsItem label={t('Max surge')} obj={dc} path="spec.strategy.rollingParams.maxSurge">
            {t('{{maxSurge}} greater than {{count}} pod', {
              maxSurge: dc.spec.strategy.rollingParams.maxSurge ?? 1,
              count: dc.spec.replicas,
            })}
          </DetailsItem>
        </>
      )}
      <DetailsItem label={t('Min ready seconds')} obj={dc} path="spec.minReadySeconds">
        {dc.spec.minReadySeconds
          ? t('{{count}} second', { count: dc.spec.minReadySeconds })
          : t('Not configured')}
      </DetailsItem>
      <DetailsItem label={t('Triggers')} obj={dc} path="spec.triggers" hideEmpty>
        {triggers}
      </DetailsItem>
      <RuntimeClass obj={dc} />
      <PodDisruptionBudgetField obj={dc} />
    </dl>
  );
};

export default DeploymentConfigDetailsList;
