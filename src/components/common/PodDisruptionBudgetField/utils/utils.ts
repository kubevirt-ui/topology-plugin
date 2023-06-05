import LabelSelector from '@topology-utils/label-selector';
import { K8sPodControllerKind } from '@topology-utils/types/k8s-types';
import { PodDisruptionBudgetKind, PodKind } from '@topology-utils/types/podTypes';

export const getPDBResource = (
  pdbResources: PodDisruptionBudgetKind[],
  resource: K8sPodControllerKind | PodKind,
): PodDisruptionBudgetKind =>
  pdbResources.find((f) =>
    new LabelSelector(f.spec.selector).matchesLabels(
      resource?.spec?.template?.metadata?.labels || resource?.metadata?.labels || {},
    ),
  );
