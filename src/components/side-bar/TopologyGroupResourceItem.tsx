import React, { FC, ReactElement } from 'react';

import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { getReferenceForResource } from '@topology-utils/k8s-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

type TopologyGroupResourceItemProps = {
  item: K8sResourceKind;
  releaseNamespace: string;
  linkForResource?: (obj: K8sResourceKind) => ReactElement;
};

const TopologyGroupResourceItem: FC<TopologyGroupResourceItemProps> = ({
  item,
  releaseNamespace,
  linkForResource,
}) => {
  const {
    metadata: { name, namespace },
  } = item;
  const kind = getReferenceForResource(item);
  const model = getK8sModel(kind);
  const resourceNamespace = model.namespaced ? namespace || releaseNamespace : null;
  const link = linkForResource ? (
    linkForResource(item)
  ) : (
    <ResourceLink kind={kind} name={name} namespace={resourceNamespace} />
  );
  return (
    <li className="list-group-item container-fluid">
      <div className="row">
        <span className="col-xs-12">{link}</span>
      </div>
    </li>
  );
};

export default TopologyGroupResourceItem;
