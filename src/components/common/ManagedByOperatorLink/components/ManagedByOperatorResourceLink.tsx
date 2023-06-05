import React, { SFC } from 'react';
import { Link } from 'react-router-dom';

import ClusterServiceVersionModel from '@kubevirt-ui/kubevirt-api/console/models/ClusterServiceVersionModel';
import { OwnerReference, ResourceIcon, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { resourcePathFromModel } from '@topology-utils';
import { referenceForOwnerRef } from '@topology-utils/k8s-utils';

type ManagedByOperatorResourceLinkProps = {
  csvName: string;
  namespace: string;
  owner: OwnerReference;
  className?: string;
};

const ManagedByOperatorResourceLink: SFC<ManagedByOperatorResourceLinkProps> = ({
  csvName,
  namespace,
  owner,
  className,
}) => {
  const ownerGroupVersionKind = referenceForOwnerRef(owner);
  const { apiGroup, kind, namespaced } = getK8sModel(ownerGroupVersionKind) ?? {};
  const ownerIsCSV =
    apiGroup === ClusterServiceVersionModel.apiGroup && kind === ClusterServiceVersionModel.kind;
  const link = resourcePathFromModel(ClusterServiceVersionModel, csvName, namespace);
  return (
    <span className={className}>
      {namespaced ? (
        <>
          <ResourceIcon kind={ownerGroupVersionKind} />
          <Link
            to={ownerIsCSV ? link : `${link}/${ownerGroupVersionKind}/${owner.name}`}
            className="co-resource-item__resource-name"
            data-test-operand-link={owner.name}
            data-test={owner.name}
          >
            {owner.name}
          </Link>
        </>
      ) : (
        <ResourceLink kind={ownerGroupVersionKind} name={owner.name} />
      )}
    </span>
  );
};

export default ManagedByOperatorResourceLink;
