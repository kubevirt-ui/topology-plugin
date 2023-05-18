import { ComponentType, ReactChildren, ReactNode } from 'react';

import {
  FirehoseResult,
  K8sKind,
  K8sResourceKindReference,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

export type PageHeadingProps = {
  'data-test'?: string;
  breadcrumbs?: { name: string; path: string }[];
  breadcrumbsFor?: (obj: K8sResourceKind) => { name: string; path: string }[];
  buttonActions?: any[];
  children?: ReactChildren;
  detail?: boolean;
  kind?: K8sResourceKindReference;
  kindObj?: K8sKind;
  // eslint-disable-next-line @typescript-eslint/ban-types
  menuActions?: Function[] | KebabOptionsCreator; // FIXME should be "KebabAction[] |" refactor pipeline-actions.tsx, etc.
  customActionMenu?: ReactNode | ((kindObj: K8sKind, obj: K8sResourceKind) => ReactNode); // Renders a custom action menu.
  link?: ReactNode;
  obj?: FirehoseResult<K8sResourceKind>;
  resourceKeys?: string[];
  style?: object;
  title?: string | JSX.Element;
  titleFunc?: (obj: K8sResourceKind) => string | JSX.Element;
  customData?: any;
  badge?: ReactNode;
  icon?: ComponentType<{ obj?: K8sResourceKind }>;
  getResourceStatus?: (resource: K8sResourceKind) => string;
  className?: string;
  centerText?: boolean;
  helpText?: ReactNode;
};
