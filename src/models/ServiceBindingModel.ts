import { K8sKind } from '@openshift-console/dynamic-plugin-sdk';
import { t } from '@topology-utils/hooks/useTopologyTranslation';

export const ServiceBindingModel: K8sKind = {
  id: 'servicebinding',
  kind: 'ServiceBinding',
  plural: 'servicebindings',
  label: 'ServiceBinding',
  labelKey: t('ServiceBinding'),
  labelPlural: 'ServiceBindings',
  labelPluralKey: t('ServiceBindings'),
  abbr: 'SB',
  apiGroup: 'binding.operators.coreos.com',
  apiVersion: 'v1alpha1',
  namespaced: true,
  crd: true,
};
