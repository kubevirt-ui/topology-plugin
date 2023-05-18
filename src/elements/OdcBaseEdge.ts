import { observable } from 'mobx';

import { K8sResourceKindReference } from '@openshift-console/dynamic-plugin-sdk';
import { BaseEdge } from '@patternfly/react-topology';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { OdcEdgeModel } from '../utils/types/topology-types';

class OdcBaseEdge extends BaseEdge {
  @observable.ref
  private resource?: K8sResourceKind;

  @observable
  private resourceKind?: K8sResourceKindReference;

  getResource(): K8sResourceKind | undefined {
    return this.resource;
  }

  setResource(resource: K8sResourceKind | undefined): void {
    this.resource = resource;
  }

  getResourceKind(): K8sResourceKindReference | undefined {
    return this.resourceKind;
  }

  setResourceKind(kind: K8sResourceKindReference | undefined): void {
    this.resourceKind = kind;
  }

  setModel(model: OdcEdgeModel): void {
    super.setModel(model);

    if ('resource' in model) {
      this.resource = model.resource;
    }
    if ('resourceKind' in model) {
      this.resourceKind = model.resourceKind;
    }
  }
}

export default OdcBaseEdge;
