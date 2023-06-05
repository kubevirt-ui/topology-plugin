import React, { FC } from 'react';

import { modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import { ResourceLink, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { PodDisruptionBudgetModel } from '@topology-utils/models';
import { getResourceDescription } from '@topology-utils/swagger-utils';
import { K8sPodControllerKind } from '@topology-utils/types/k8s-types';
import { PodDisruptionBudgetKind, PodKind } from '@topology-utils/types/podTypes';

import DetailsItem from '../DetailsItem/DetailsItem';

import AvailabilityRequirement from './components/AvailabilityRequirement';
import { getPDBResource } from './utils/utils';

type PodDisruptionBudgetFieldProps = {
  obj: K8sPodControllerKind | PodKind;
};

const PodDisruptionBudgetField: FC<PodDisruptionBudgetFieldProps> = ({ obj }) => {
  const { t } = useTopologyTranslation();
  const [pdbResources] = useK8sWatchResource<PodDisruptionBudgetKind[]>({
    groupVersionKind: {
      group: PodDisruptionBudgetModel.apiGroup,
      kind: PodDisruptionBudgetModel.kind,
      version: PodDisruptionBudgetModel.apiVersion,
    },
    isList: true,
    namespaced: true,
    namespace: obj.metadata.namespace,
  });
  const pdb = getPDBResource(pdbResources, obj);
  const { replicas } = obj.spec ?? {};
  const pdbDescription = getResourceDescription(PodDisruptionBudgetModel);

  return (
    <DetailsItem label={t('PodDisruptionBudget')} description={pdbDescription}>
      {pdb ? (
        <>
          <ResourceLink
            kind={modelToRef(PodDisruptionBudgetModel)}
            name={pdb.metadata.name}
            namespace={pdb.metadata.namespace}
          />
          {replicas && <AvailabilityRequirement pdb={pdb} replicas={replicas} />}
        </>
      ) : (
        t('No PodDisruptionBudget')
      )}
    </DetailsItem>
  );
};

export default PodDisruptionBudgetField;
