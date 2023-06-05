import { useContext } from 'react';

import { useDeepCompareMemoize } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useDeepCompareMemoize';

import { DisplayFilters } from '../utils/types/topology-types';

import { FilterContext } from './FilterProvider';

const useDisplayFilters = (): DisplayFilters => {
  const { filters } = useContext(FilterContext);
  return useDeepCompareMemoize(filters);
};

export { useDisplayFilters };
