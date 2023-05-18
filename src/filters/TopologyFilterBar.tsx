import React, { FC, useContext, useState } from 'react';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';

import { ConsoleLinkModel } from '@kubevirt-ui/kubevirt-api/console';
import {
  BlueInfoCircleIcon,
  getGroupVersionKindForModel,
  K8sResourceCommon,
  useFlag,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk-internal';
import {
  Button,
  Popover,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarGroupVariant,
  ToolbarItem,
} from '@patternfly/react-core';
import { isNode, Visualization } from '@patternfly/react-topology';
import { setQueryArgument } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import ExternalLink from '../components/common/ExternalLink';
import ResourceQuotaAlert from '../components/dev-console/ResourceQuotaAlert/ResourceQuotaAlert';
import ExportApplication from '../components/export-app/ExportApplication';
import TopologyQuickSearchButton from '../components/quick-search/TopologyQuickSearchButton';
import { ALLOW_EXPORT_APP } from '../const';
import { getNamespaceDashboardKialiLink, getResource } from '../utils';
import useQueryParams from '../utils/hooks/useQueryParams';
import { requirementFromString } from '../utils/selector-requirement';
import { TopologyViewType } from '../utils/types/topology-types';

import {
  clearAll,
  clearLabelFilter,
  clearNameFilter,
  getSupportedTopologyFilters,
  getSupportedTopologyKinds,
  NameLabelFilterValues,
  onSearchChange,
  TOPOLOGY_LABELS_FILTER_KEY,
  TOPOLOGY_SEARCH_FILTER_KEY,
} from './filter-utils';
import FilterDropdown from './FilterDropdown';
import { FilterContext } from './FilterProvider';
import KindFilterDropdown from './KindFilterDropdown';
import NameLabelFilterDropdown from './NameLabelFilterDropdown';

import './TopologyFilterBar.scss';

type StateProps = {
  supportedFilters: string[];
  supportedKinds: { [key: string]: number };
};

type OwnProps = {
  isDisabled: boolean;
  visualization?: Visualization;
  viewType: TopologyViewType;
  setIsQuickSearchOpen: (isOpen: boolean) => void;
};

type TopologyFilterBarProps = StateProps & OwnProps;

const TopologyFilterBar: FC<TopologyFilterBarProps> = ({
  supportedFilters,
  supportedKinds,
  isDisabled,
  visualization,
  viewType,
  setIsQuickSearchOpen,
}) => {
  const { t } = useTopologyTranslation();
  const [activeNamespace] = useActiveNamespace();
  const { filters, setTopologyFilters: onFiltersChange } = useContext(FilterContext);
  const [labelFilterInput, setLabelFilterInput] = useState('');
  const [consoleLinks] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: getGroupVersionKindForModel(ConsoleLinkModel),
    optional: true,
  });
  const kialiLink = getNamespaceDashboardKialiLink(consoleLinks, activeNamespace);
  const queryParams = useQueryParams();
  const searchQuery = queryParams.get(TOPOLOGY_SEARCH_FILTER_KEY) || '';
  const labelsQuery = queryParams.get(TOPOLOGY_LABELS_FILTER_KEY)?.split(',') || [];
  const isExportApplicationEnabled = useFlag(ALLOW_EXPORT_APP);
  const updateNameFilter = (value: string) => {
    const query = value?.trim();
    onSearchChange(query);
  };

  const updateLabelFilter = (value: string, endOfString: boolean) => {
    setLabelFilterInput(value);
    if (requirementFromString(value) !== undefined && endOfString) {
      const updatedLabels = [...new Set([...labelsQuery, value])];
      setQueryArgument(TOPOLOGY_LABELS_FILTER_KEY, updatedLabels.join(','));
      setLabelFilterInput('');
    }
  };

  const updateSearchFilter = (type: string, value: string, endOfString: boolean) => {
    type === NameLabelFilterValues.Label
      ? updateLabelFilter(value, endOfString)
      : updateNameFilter(value);
  };

  const removeLabelFilter = (filter: string, value: string) => {
    const newLabels = labelsQuery.filter((keepItem: string) => keepItem !== value);
    newLabels.length > 0
      ? setQueryArgument(TOPOLOGY_LABELS_FILTER_KEY, newLabels.join(','))
      : clearLabelFilter();
  };

  const resources = (visualization?.getElements() || [])
    .filter(isNode)
    .map(getResource)
    .filter((r) => !!r);

  return (
    <Toolbar className="co-namespace-bar odc-topology-filter-bar" clearAllFilters={clearAll}>
      <ToolbarContent>
        <ToolbarItem>
          <TopologyQuickSearchButton onClick={() => setIsQuickSearchOpen(true)} />
        </ToolbarItem>
        <ToolbarGroup variant={ToolbarGroupVariant['filter-group']}>
          <ToolbarItem>
            <FilterDropdown
              filters={filters}
              viewType={viewType}
              supportedFilters={supportedFilters}
              onChange={onFiltersChange}
              isDisabled={isDisabled}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup variant={ToolbarGroupVariant['filter-group']}>
          <ToolbarItem data-test="filter-by-resource">
            <KindFilterDropdown
              filters={filters}
              supportedKinds={supportedKinds}
              onChange={onFiltersChange}
              isDisabled={isDisabled}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup variant={ToolbarGroupVariant['filter-group']}>
          <ToolbarItem>
            <ToolbarFilter
              deleteChipGroup={clearLabelFilter}
              chips={[...labelsQuery]}
              deleteChip={removeLabelFilter}
              categoryName={t('Label')}
            >
              <ToolbarFilter
                chips={searchQuery.length > 0 ? [searchQuery] : []}
                deleteChip={clearNameFilter}
                categoryName={t('Name')}
              >
                <NameLabelFilterDropdown
                  onChange={updateSearchFilter}
                  nameFilterInput={searchQuery}
                  labelFilterInput={labelFilterInput}
                  data={resources}
                  isDisabled={isDisabled}
                />
              </ToolbarFilter>
            </ToolbarFilter>
          </ToolbarItem>
          {viewType === TopologyViewType.graph ? (
            <ToolbarItem>
              <Popover
                aria-label={t('Find by name')}
                position="left"
                bodyContent={
                  <Trans ns="plugin__topology-plugin">
                    Search results may appear outside of the visible area.{' '}
                    <Button
                      variant="link"
                      onClick={() => visualization.getGraph().fit(80)}
                      isInline
                    >
                      Click here
                    </Button>{' '}
                    to fit to the screen.
                  </Trans>
                }
              >
                <Button
                  variant="link"
                  className="odc-topology-filter-bar__info-icon"
                  aria-label={t('Find by name')}
                  isDisabled={isDisabled}
                >
                  <BlueInfoCircleIcon />
                </Button>
              </Popover>
            </ToolbarItem>
          ) : null}
        </ToolbarGroup>
        <ToolbarGroup
          variant={ToolbarGroupVariant['button-group']}
          alignment={{ default: 'alignRight' }}
        >
          <ToolbarItem
            className={
              isExportApplicationEnabled || kialiLink
                ? 'odc-topology-filter-bar__resource-quota-warning-block'
                : ''
            }
          >
            <ResourceQuotaAlert namespace={activeNamespace} />
          </ToolbarItem>
          {kialiLink && (
            <ToolbarItem className="odc-topology-filter-bar__kiali-link1">
              <ExternalLink href={kialiLink} text={t('Kiali')} />
            </ToolbarItem>
          )}
          <ExportApplication namespace={activeNamespace} isDisabled={isDisabled} />
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

const mapStateToProps = (state: RootState): StateProps => {
  const states = {
    supportedFilters: getSupportedTopologyFilters(state),
    supportedKinds: getSupportedTopologyKinds(state),
  };
  return states;
};

export default connect<StateProps>(mapStateToProps)(TopologyFilterBar);
