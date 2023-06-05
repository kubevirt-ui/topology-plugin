import React from 'react';
import { Link } from 'react-router-dom';

import { ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { getReferenceForResource } from '@topology-utils/k8s-utils';
import { resourcePath } from '@topology-utils/resource-link-utils';

import { getResource } from '../../utils';

export const getWorkloadResourceLink = (element: GraphElement) => {
  const resource = getResource(element);
  if (!resource) {
    return null;
  }
  const kindReference = getReferenceForResource(resource);
  return (
    <>
      <ResourceIcon className="co-m-resource-icon--lg" kind={kindReference} />
      <Link
        to={resourcePath(kindReference, resource.metadata.name, resource.metadata.namespace)}
        className="co-resource-item__resource-name"
      >
        {resource.metadata.name}
      </Link>
    </>
  );
};
