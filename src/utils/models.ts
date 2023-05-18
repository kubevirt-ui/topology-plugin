import { K8sKind } from '@openshift-console/dynamic-plugin-sdk';
import { t } from '@topology-utils/hooks/useTopologyTranslation';

export const PodDisruptionBudgetModel: K8sKind = {
  label: 'PodDisruptionBudget',
  labelKey: t('PodDisruptionBudget'),
  labelPlural: 'PodDisruptionBudgets',
  labelPluralKey: t('PodDisruptionBudgets'),
  plural: 'poddisruptionbudgets',
  apiVersion: 'v1',
  apiGroup: 'policy',
  abbr: 'PDB',
  namespaced: true,
  kind: 'PodDisruptionBudget',
  id: 'poddisruptionbudget',
};
