import React, { FC, MouseEvent, useState } from 'react';

import { Select, SelectGroup, SelectOption, SelectVariant, Switch } from '@patternfly/react-core';
import useTelemetry from '@topology-utils/hooks/useTelemetry/useTelemetry';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import {
  DisplayFilters,
  TopologyDisplayFilterType,
  TopologyViewType,
} from '../utils/types/topology-types';

import { EXPAND_GROUPS_FILTER_ID } from './const';

import './FilterDropdown.scss';

type FilterDropdownProps = {
  filters: DisplayFilters;
  viewType: TopologyViewType;
  supportedFilters: string[];
  onChange: (filter: DisplayFilters) => void;
  isDisabled?: boolean;
  opened?: boolean; // Use only for testing
};

const FilterDropdown: FC<FilterDropdownProps> = ({
  filters,
  viewType,
  supportedFilters,
  onChange,
  isDisabled = false,
  opened = false,
}) => {
  const { t } = useTopologyTranslation();
  const fireTelemetryEvent = useTelemetry();
  const [isOpen, setIsOpen] = useState(opened);
  const groupsExpanded = filters?.find((f) => f.id === EXPAND_GROUPS_FILTER_ID)?.value ?? true;

  const onToggle = (open: boolean): void => setIsOpen(open);
  const onSelect = (e: MouseEvent, key: string) => {
    const index = filters.findIndex((f) => f.id === key);
    const filter = { ...filters[index], value: (e.target as HTMLInputElement).checked };
    onChange([...filters.slice(0, index), filter, ...filters.slice(index + 1)]);
    fireTelemetryEvent('Topology Display Option Changed', {
      property: key,
      value: (e.target as HTMLInputElement).checked,
    });
  };

  const onGroupsExpandedChange = (value: boolean) => {
    const index = filters?.findIndex((f) => f.id === EXPAND_GROUPS_FILTER_ID) ?? -1;
    if (index === -1) {
      return;
    }
    const filter = {
      ...filters[index],
      value,
    };
    onChange([...filters.slice(0, index), filter, ...filters.slice(index + 1)]);
    fireTelemetryEvent('Topology Display Option Changed', {
      property: EXPAND_GROUPS_FILTER_ID,
      value,
    });
  };

  const expandFilters = filters
    .filter(
      (f) =>
        f.type === TopologyDisplayFilterType.expand &&
        f.id !== EXPAND_GROUPS_FILTER_ID &&
        supportedFilters.includes(f.id),
    )
    .sort((a, b) => a.priority - b.priority);

  const showFilters = filters
    .filter((f) => f.type === TopologyDisplayFilterType.show && supportedFilters.includes(f.id))
    .sort((a, b) => a.priority - b.priority);

  const isSelectDisabled =
    isDisabled ||
    (viewType === TopologyViewType.graph
      ? !expandFilters.length && !showFilters.length
      : !expandFilters.length);

  const selectContent = (
    <div className="odc-topology-filter-dropdown">
      {expandFilters.length ? (
        <div className="odc-topology-filter-dropdown__group">
          <span className="odc-topology-filter-dropdown__expand-groups-switcher">
            <span className="pf-c-select__menu-group-title">{t('Expand')}</span>
            <Switch
              aria-label={t('Collapse groups')}
              isChecked={groupsExpanded}
              onChange={onGroupsExpandedChange}
            />
          </span>
          <SelectGroup className="odc-topology-filter-dropdown__expand-groups-label">
            {expandFilters.map((filter) => (
              <SelectOption
                key={filter.id}
                value={filter.id}
                isDisabled={!groupsExpanded}
                isChecked={filter.value}
              >
                {filter.labelKey ? t(filter.labelKey) : filter.label}
              </SelectOption>
            ))}
          </SelectGroup>
        </div>
      ) : null}
      {viewType === TopologyViewType.graph && showFilters.length ? (
        <div className="odc-topology-filter-dropdown__group">
          <SelectGroup label={t('Show')}>
            {showFilters.map((filter) => (
              <SelectOption key={filter.id} value={filter.id} isChecked={filter.value}>
                {filter.labelKey ? t(filter.labelKey) : filter.label}
              </SelectOption>
            ))}
          </SelectGroup>
        </div>
      ) : null}
    </div>
  );

  return (
    <Select
      className="odc-topology-filter-dropdown__select"
      variant={SelectVariant.checkbox}
      customContent={selectContent}
      isDisabled={isSelectDisabled}
      onToggle={onToggle}
      isOpen={isOpen}
      onSelect={onSelect}
      placeholderText={t('Display options')}
      isGrouped
      isCheckboxSelectionBadgeHidden
    />
  );
};

export default FilterDropdown;
