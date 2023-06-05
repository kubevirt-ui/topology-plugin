import { ReactElement } from 'react';

import { K8sKind } from '@openshift-console/dynamic-plugin-sdk';
import { chart_color_cyan_400 as knativeServingColor } from '@patternfly/react-tokens/dist/js/chart_color_cyan_400';
import { t } from '@topology-utils/hooks/useTopologyTranslation';

import { KNATIVE_SERVING_APIGROUP } from '../../../knative/knative-const';

export type PodRingLabelType = {
  subTitle: string;
  title: string;
  titleComponent: ReactElement;
};

export type PodRingLabelData = {
  title: string;
  longTitle: boolean;
  subTitle: string;
  longSubtitle: boolean;
  reversed: boolean;
};

const apiVersion = 'v1';

export const RevisionModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Revision',
  label: 'Revision',
  labelKey: t('Revision'),
  labelPluralKey: t('Revisions'),
  labelPlural: 'Revisions',
  plural: 'revisions',
  id: 'revision',
  abbr: 'REV',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};
