import React, { FC } from 'react';

import { isNil } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { PodDisruptionBudgetKind } from '@topology-utils/types/podTypes';

type AvailabilityRequirementProps = {
  pdb: PodDisruptionBudgetKind;
  replicas: number;
};

const AvailabilityRequirement: FC<AvailabilityRequirementProps> = ({ pdb, replicas }) => {
  const { t } = useTopologyTranslation();
  return (
    <>
      {!isNil(pdb?.spec?.minAvailable)
        ? t('Min available {{minAvailable}} of {{count}} pod', {
            minAvailable: pdb.spec.minAvailable,
            count: replicas,
          })
        : t('Max unavailable {{maxUnavailable}} of {{count}} pod', {
            maxUnavailable: pdb?.spec?.maxUnavailable,
            count: replicas,
          })}
    </>
  );
};

export default AvailabilityRequirement;
