import React, { FC } from 'react';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { DaemonSetKind } from '@topology-utils/types/k8s-types';

import DetailsItem from '../common/DetailsItem/DetailsItem';
import PodDisruptionBudgetField from '../common/PodDisruptionBudgetField/PodDisruptionBudgetField';

type DaemonSetDetailsListProps = {
  ds: DaemonSetKind;
};

const DaemonSetDetailsList: FC<DaemonSetDetailsListProps> = ({ ds }) => {
  const { t } = useTopologyTranslation();
  return (
    <dl className="co-m-pane__details">
      <DetailsItem label={t('Current count')} obj={ds} path="status.currentNumberScheduled" />
      <DetailsItem label={t('Desired count')} obj={ds} path="status.desiredNumberScheduled" />
      <PodDisruptionBudgetField obj={ds} />
    </dl>
  );
};

export default DaemonSetDetailsList;
