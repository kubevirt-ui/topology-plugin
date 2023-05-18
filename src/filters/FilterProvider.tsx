import React, { createContext, FC, useCallback, useEffect, useState } from 'react';

import { useUserSettingsCompatibility } from '@topology-utils/hooks/useUserSettingsCompatibility/useUserSettingsCompatibility';

import { TOPOLOGY_DISPLAY_FILTERS_LOCAL_STORAGE_KEY } from '../redux/const';
import { DisplayFilters } from '../utils/types/topology-types';

import { DEFAULT_TOPOLOGY_FILTERS } from './const';

const TOPOLOGY_DISPLAY_FILTERS_USER_SETTINGS_KEY = `devconsole.topology.filters`;

const getTopologyFilters = (appliedFilters: AppliedFilters) => {
  const filters = [...DEFAULT_TOPOLOGY_FILTERS];
  filters.forEach((filter) => {
    if (appliedFilters[filter.id] !== undefined) {
      filter.value = appliedFilters[filter.id];
    }
  });

  return filters;
};

const getAppliedFilters = (filters: DisplayFilters): { [id: string]: boolean } => {
  if (!filters?.length) {
    return {};
  }

  return filters.reduce((acc, filter) => {
    acc[filter.id] = filter.value;
    return acc;
  }, {});
};

type AppliedFilters = { [filterKey: string]: boolean };
type SetTopologyFilters = (filters: DisplayFilters) => void;

const useFilterContextValues = (): [
  DisplayFilters,
  AppliedFilters,
  boolean,
  SetTopologyFilters,
] => {
  const [appliedFilters, setAppliedFilters, appliedFiltersLoaded] = useUserSettingsCompatibility(
    TOPOLOGY_DISPLAY_FILTERS_USER_SETTINGS_KEY,
    TOPOLOGY_DISPLAY_FILTERS_LOCAL_STORAGE_KEY,
    getAppliedFilters(DEFAULT_TOPOLOGY_FILTERS),
  );
  const [filtersLoaded, setFiltersLoaded] = useState<boolean>(false);
  const [filters, setFilters] = useState<DisplayFilters>([]);

  useEffect(() => {
    if (appliedFiltersLoaded && !filtersLoaded) {
      setFilters(getTopologyFilters(appliedFilters));
      setFiltersLoaded(true);
    }
  }, [appliedFilters, appliedFiltersLoaded, filtersLoaded]);

  const setTopologyFilters = useCallback(
    (displayFilters: DisplayFilters) => {
      setFilters(displayFilters);
      setAppliedFilters(getAppliedFilters(displayFilters));
    },
    [setAppliedFilters],
  );

  return [filters, appliedFilters, appliedFilters && filtersLoaded, setTopologyFilters];
};

type FilterContextType = {
  filters?: DisplayFilters;
  appliedFilters?: AppliedFilters;
  setTopologyFilters?: SetTopologyFilters;
};

export const FilterContext = createContext<FilterContextType>({});

export const FilterProvider: FC = ({ children }) => {
  const [filters, appliedFilters, loaded, setTopologyFilters] = useFilterContextValues();
  return (
    <FilterContext.Provider value={{ filters, appliedFilters, setTopologyFilters }}>
      {loaded ? children : null}
    </FilterContext.Provider>
  );
};
