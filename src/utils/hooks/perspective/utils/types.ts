import { AccessReviewResourceAttributes } from '@openshift-console/dynamic-plugin-sdk';

export enum PerspectiveVisibilityState {
  Enabled = 'Enabled',
  Disabled = 'Disabled',
  AccessReview = 'AccessReview',
}

export type PerspectiveAccessReview = {
  required?: AccessReviewResourceAttributes[];
  missing?: AccessReviewResourceAttributes[];
};

export type PerspectiveVisibility = {
  state: PerspectiveVisibilityState;
  accessReview?: PerspectiveAccessReview;
};

export type PerspectivePinnedResource = {
  group: string;
  version: string;
  resource: string;
};

export type Perspective = {
  id: string;
  visibility: PerspectiveVisibility;
  pinnedResources?: PerspectivePinnedResource[];
};
