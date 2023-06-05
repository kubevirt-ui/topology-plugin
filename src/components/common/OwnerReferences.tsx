import React, { FC } from 'react';
import get from 'lodash.get';

import { OwnerReference, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { referenceForOwnerRef } from '@topology-utils/k8s-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

const OwnerReferences: FC<OwnerReferencesProps> = ({ resource }) => {
  const { t } = useTopologyTranslation();
  const owners = (get(resource.metadata, 'ownerReferences') || []).map((o: OwnerReference) => (
    <ResourceLink
      key={o.uid}
      kind={referenceForOwnerRef(o)}
      name={o.name}
      namespace={resource.metadata.namespace}
    />
  ));
  return owners.length ? <>{owners}</> : <span className="text-muted">{t('No owner')}</span>;
};

type OwnerReferencesProps = {
  resource: K8sResourceKind;
};

export default OwnerReferences;
