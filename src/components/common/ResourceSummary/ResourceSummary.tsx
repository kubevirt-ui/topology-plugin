import React, { FC, ReactNode } from 'react';
import get from 'lodash.get';

import { ResourceLink, Timestamp, useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { Button } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { size } from '@topology-utils/common-utils';
import { Toleration } from '@topology-utils/hooks/useBuildsConfigWatcher/utils/types';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { getReferenceForResource } from '@topology-utils/k8s-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import DetailsItem from '../DetailsItem/DetailsItem';
import { LabelList } from '../LabelList/LabelList';
import OwnerReferences from '../OwnerReferences';
import Selector from '../Selector';

import { editLabelsModal, getTolerationsPath } from './utils/utils';

export type ResourceSummaryProps = {
  resource: K8sResourceKind;
  showPodSelector?: boolean;
  showNodeSelector?: boolean;
  showAnnotations?: boolean;
  showTolerations?: boolean;
  showLabelEditor?: boolean;
  canUpdateResource?: boolean;
  podSelector?: string;
  nodeSelector?: string;
  children?: ReactNode;
  customPathName?: string;
};

const ResourceSummary: FC<ResourceSummaryProps> = ({
  children,
  resource,
  customPathName,
  showPodSelector = false,
  showNodeSelector = false,
  showAnnotations = true,
  showTolerations = false,
  showLabelEditor = true,
  canUpdateResource = true,
  podSelector = 'spec.selector',
  nodeSelector = 'spec.template.spec.nodeSelector',
}) => {
  const { t } = useTopologyTranslation();
  const { metadata } = resource;
  const reference = getReferenceForResource(resource);
  const model = getK8sModel(reference);
  const tolerationsPath = getTolerationsPath(resource);
  const tolerations: Toleration[] = get(resource, tolerationsPath);
  const canUpdateAccess = useAccessReview({
    group: model.apiGroup,
    resource: model.plural,
    verb: 'patch',
    name: metadata.name,
    namespace: metadata.namespace,
  });
  const canUpdate = canUpdateAccess && canUpdateResource;

  return (
    <dl data-test-id="resource-summary" className="co-m-pane__details">
      <DetailsItem label={t('Name')} obj={resource} path={customPathName || 'metadata.name'} />
      {metadata.namespace && (
        <DetailsItem label={t('Namespace')} obj={resource} path="metadata.namespace">
          <ResourceLink
            kind="Namespace"
            name={metadata.namespace}
            title={metadata.uid}
            namespace={null}
          />
        </DetailsItem>
      )}
      <DetailsItem
        label={t('Labels')}
        obj={resource}
        path="metadata.labels"
        valueClassName="details-item__value--labels"
        onEdit={(e) => editLabelsModal(e, { resource, kind: model })}
        canEdit={showLabelEditor && canUpdate}
        editAsGroup
      >
        <LabelList kind={reference} labels={metadata.labels} />
      </DetailsItem>
      {showPodSelector && (
        <DetailsItem label={t('Pod selector')} obj={resource} path={podSelector}>
          <Selector
            selector={get(resource, podSelector)}
            namespace={get(resource, 'metadata.namespace')}
          />
        </DetailsItem>
      )}
      {showNodeSelector && (
        <DetailsItem label={t('Node selector')} obj={resource} path={nodeSelector}>
          <Selector kind={t('Node')} selector={get(resource, nodeSelector)} />
        </DetailsItem>
      )}
      {showTolerations && (
        <DetailsItem label={t('Tolerations')} obj={resource} path={tolerationsPath}>
          {canUpdate ? (
            <Button
              type="button"
              isInline
              onClick={Kebab.factory.ModifyTolerations(model, resource).callback}
              variant="link"
            >
              {t('{{count}} toleration', { count: size(tolerations) })}
              <PencilAltIcon className="co-icon-space-l pf-c-button-icon--plain" />
            </Button>
          ) : (
            t('{{count}} toleration', { count: size(tolerations) })
          )}
        </DetailsItem>
      )}
      {showAnnotations && (
        <DetailsItem label={t('Annotations')} obj={resource} path="metadata.annotations">
          {canUpdate ? (
            <Button
              data-test="edit-annotations"
              type="button"
              isInline
              onClick={Kebab.factory.ModifyAnnotations(model, resource).callback}
              variant="link"
            >
              {t('{{count}} annotation', { count: size(metadata.annotations) })}
              <PencilAltIcon className="co-icon-space-l pf-c-button-icon--plain" />
            </Button>
          ) : (
            t('{{count}} annotation', { count: size(metadata.annotations) })
          )}
        </DetailsItem>
      )}
      {children}
      <DetailsItem label={t('Created at')} obj={resource} path="metadata.creationTimestamp">
        <Timestamp timestamp={metadata.creationTimestamp} />
      </DetailsItem>
      <DetailsItem label={t('Owner')} obj={resource} path="metadata.ownerReferences">
        <OwnerReferences resource={resource} />
      </DetailsItem>
    </dl>
  );
};

export default ResourceSummary;
