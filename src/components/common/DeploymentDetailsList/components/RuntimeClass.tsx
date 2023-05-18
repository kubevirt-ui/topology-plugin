import React, { FC } from 'react';

import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import DetailsItem from '../../DetailsItem/DetailsItem';

export type RuntimeClassProps = {
  obj: K8sResourceCommon;
  path?: string;
};

const RuntimeClass: FC<RuntimeClassProps> = ({ obj, path }) => {
  const { t } = useTopologyTranslation();
  return (
    <DetailsItem
      label={t('Runtime class')}
      obj={obj}
      path={path || 'spec.template.spec.runtimeClassName'}
      hideEmpty
    />
  );
};

export default RuntimeClass;
