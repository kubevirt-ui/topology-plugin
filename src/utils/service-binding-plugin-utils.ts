import {
  ComputedServiceBindingStatus,
  ServiceBinding,
} from '@topology-utils/types/service-binding-types';

const expectedConditionTypes = ['CollectionReady', 'InjectionReady', 'Ready'];
const expectedConditionStatus = 'True';

export const getComputedServiceBindingStatus = (
  serviceBinding: ServiceBinding,
): ComputedServiceBindingStatus => {
  const conditions = serviceBinding?.status?.conditions || [];
  const isConnected =
    conditions.filter(
      (condition) =>
        expectedConditionTypes.includes(condition.type) &&
        condition.status === expectedConditionStatus,
    ).length === expectedConditionTypes.length;

  return isConnected ? ComputedServiceBindingStatus.CONNECTED : ComputedServiceBindingStatus.ERROR;
};
