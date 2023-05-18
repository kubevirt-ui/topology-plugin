import React, { ComponentType, FC } from 'react';
import { observer } from 'mobx-react';

import { K8sVerb, useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { Node } from '@patternfly/react-topology';

import { getResource } from './topology-utils';

type ComponentProps = {
  element: Node;
};

export const withEditReviewAccess = (verb: K8sVerb) => (WrappedComponent: ComponentType) => {
  const Component: FC<ComponentProps> = (props) => {
    const resourceObj = getResource(props.element);
    const resourceModel = getK8sModel(resourceObj);
    const editAccess = useAccessReview({
      group: resourceModel.apiGroup,
      verb,
      resource: resourceModel.plural,
      name: resourceObj.metadata.name,
      namespace: resourceObj.metadata.namespace,
    });
    return <WrappedComponent {...(props as any)} canEdit={editAccess} />;
  };
  Component.displayName = `withEditReviewAccess(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;
  return observer(Component);
};
