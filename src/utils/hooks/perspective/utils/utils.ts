import { checkAccess } from '@openshift-console/dynamic-plugin-sdk';
import { PerspectiveAccessReview } from '@topology-utils/hooks/perspective/utils/types';

export const hasReviewAccess = async (accessReview: PerspectiveAccessReview) => {
  let hasAccess = true;
  const requiredAccessReview = accessReview?.required;
  const missingAccessReview = accessReview?.missing;
  const requiredPromises =
    requiredAccessReview?.length > 0 &&
    requiredAccessReview.map((resourceAttributes) => checkAccess(resourceAttributes));
  const missingPromises =
    missingAccessReview?.length &&
    missingAccessReview?.map((resourceAttributes) => checkAccess(resourceAttributes));

  requiredPromises?.length > 0 &&
    (await Promise.all(requiredPromises)
      .then((values) => {
        // enable the perspective if all the access review checks are successful
        hasAccess = hasAccess && values.every((val) => val?.status.allowed);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('AccessReview check failed', e);
        hasAccess = false;
      }));

  missingPromises?.length > 0 &&
    (await Promise.all(missingPromises)
      .then((values) => {
        // enable perspective if atleast one access review check fails
        hasAccess = hasAccess && !values.every((val) => val?.status.allowed);
      })
      .catch((e) => {
        // no update when a missing check fails
        // eslint-disable-next-line no-console
        console.warn('AccessReview check failed', e);
      }));

  return hasAccess;
};
