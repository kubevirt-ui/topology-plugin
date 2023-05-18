import {
  AccessReviewResourceAttributes,
  K8sModel,
  K8sResourceCommon,
  K8sVerb,
} from '@openshift-console/dynamic-plugin-sdk';

/**
 * function to build AccessReviewResourceAttributes from a resource
 * @param model - k8s model
 * @param obj - resource
 * @param verb - verb
 * @param subresource - subresource
 * @returns AccessReviewResourceAttributes
 */
export const asAccessReview = (
  model: K8sModel,
  obj: K8sResourceCommon,
  verb: K8sVerb,
  subresource?: string,
): AccessReviewResourceAttributes => {
  if (!obj) {
    console.warn('review obj should not be null');
    return null;
  }
  return {
    group: model.apiGroup,
    resource: model.plural,
    name: obj?.metadata?.name,
    namespace: obj?.metadata?.namespace,
    verb,
    subresource,
  };
};
