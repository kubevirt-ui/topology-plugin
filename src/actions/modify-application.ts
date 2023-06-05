import { Action, K8sKind } from '@openshift-console/dynamic-plugin-sdk';
import { t } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { editApplicationModal } from '../components/modals';

export const getModifyApplicationAction = (
  kind: K8sKind,
  obj: K8sResourceKind,
  insertBefore?: string | string[],
): Action => {
  return {
    id: 'modify-application',
    label: t('Edit application grouping'),
    insertBefore: insertBefore ?? 'edit-pod-count',
    cta: () =>
      editApplicationModal({
        resourceKind: kind,
        resource: obj,
        blocking: true,
        initialApplication: '',
      }),
    accessReview: {
      verb: 'patch',
      group: kind.apiGroup,
      resource: kind.plural,
      namespace: obj?.metadata?.namespace,
    },
  };
};
