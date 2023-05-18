import React, { ComponentType } from 'react';

import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import labelsModal from '../../LabelsModal/components/LabelsModal';

export const editLabelsModal = (e, props) => {
  e.preventDefault();
  labelsModal(props);
};

export const pluralize = (
  i: number,
  singular: string,
  plural = `${singular}s`,
  includeCount = true,
) => {
  const pluralized = `${i === 1 ? singular : plural}`;
  return includeCount ? `${i || 0} ${pluralized}` : pluralized;
};

export const detailsPage = <T extends Record<any, any>>(Component: ComponentType<T>) =>
  function DetailsPage(props: T) {
    return <Component {...props} />;
  };

export const getTolerationsPath = (obj: K8sResourceKind): string => {
  // FIXME: Is this correct for all types (jobs, cron jobs)? It would be better for the embedding page to pass in the path.
  return obj.kind === 'Pod' ? 'spec.tolerations' : 'spec.template.spec.tolerations';
};
