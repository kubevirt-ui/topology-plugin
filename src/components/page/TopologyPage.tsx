import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { match as RMatch } from 'react-router-dom';

import { ErrorBoundaryFallbackPage } from '@openshift-console/dynamic-plugin-sdk';
import { removeQueryArgument, setQueryArgument } from '@patternfly/quickstarts';
import useQueryParams from '@topology-utils/hooks/useQueryParams';
import { useUserSettingsCompatibility } from '@topology-utils/hooks/useUserSettingsCompatibility/useUserSettingsCompatibility';
import { NamespacedPageVariants } from '@topology-utils/types/commonTypes';
import { TopologyViewType } from '@topology-utils/types/topology-types';

import {
  LAST_TOPOLOGY_OVERVIEW_OPEN_STORAGE_KEY,
  LAST_TOPOLOGY_VIEW_LOCAL_STORAGE_KEY,
  TOPOLOGY_VIEW_CONFIG_STORAGE_KEY,
} from '../../const';
import DataModelProvider from '../../data-transforms/DataModelProvider';
import { TOPOLOGY_SEARCH_FILTER_KEY } from '../../filters';
import { FilterProvider } from '../../filters/FilterProvider';
import { usePreferredTopologyView } from '../../user-preferences/usePreferredTopologyView';
import withFallback from '../error/withFallback';

import PageContentsWithStartGuide from './PageContents';
import TopologyPageToolbar from './TopologyPageToolbar';

interface TopologyPageProps {
  match: RMatch<{
    name?: string;
  }>;
  activeViewStorageKey?: string;
  hideProjects?: boolean;
  defaultViewType?: TopologyViewType;
}

export const TopologyPage: FC<TopologyPageProps> = ({
  match,
  activeViewStorageKey = LAST_TOPOLOGY_VIEW_LOCAL_STORAGE_KEY,
  hideProjects = false,
  defaultViewType = TopologyViewType.graph,
}) => {
  const [preferredTopologyView, preferredTopologyViewLoaded] = usePreferredTopologyView();
  const [topologyLastView, setTopologyLastView, isTopologyLastViewLoaded] =
    useUserSettingsCompatibility<TopologyViewType>(
      TOPOLOGY_VIEW_CONFIG_STORAGE_KEY,
      activeViewStorageKey,
      defaultViewType,
    );

  const loaded: boolean = preferredTopologyViewLoaded && isTopologyLastViewLoaded;

  const topologyViewState = useMemo((): TopologyViewType => {
    if (!loaded) {
      return null;
    }

    if (preferredTopologyView === 'latest') {
      return topologyLastView;
    }

    return (preferredTopologyView || topologyLastView) as TopologyViewType;
  }, [loaded, preferredTopologyView, topologyLastView]);

  const namespace = match.params.name;
  const queryParams = useQueryParams();
  const viewType =
    (queryParams.get('view') as TopologyViewType) || topologyViewState || defaultViewType;

  useEffect(() => {
    const lastOverviewOpen = JSON.parse(
      sessionStorage.getItem(LAST_TOPOLOGY_OVERVIEW_OPEN_STORAGE_KEY) ?? '{}',
    );
    if (loaded && namespace in lastOverviewOpen) {
      setQueryArgument('selectId', lastOverviewOpen[namespace]);
    }
  }, [loaded, namespace]);

  useEffect(() => {
    if (!queryParams.get('view') && loaded) {
      setQueryArgument('view', topologyViewState || defaultViewType);
    }
  }, [defaultViewType, topologyViewState, queryParams, loaded]);

  const onViewChange = useCallback(
    (newViewType: TopologyViewType) => {
      setQueryArgument('view', newViewType);
      setTopologyLastView(newViewType);
    },
    [setTopologyLastView],
  );

  const handleNamespaceChange = (ns: string) => {
    if (ns !== namespace) {
      removeQueryArgument(TOPOLOGY_SEARCH_FILTER_KEY);
    }
  };

  // eslint-disable-next-line no-nested-ternary
  const namespacedPageVariant = namespace
    ? viewType === TopologyViewType.graph
      ? NamespacedPageVariants.default
      : NamespacedPageVariants.light
    : NamespacedPageVariants.light;

  return (
    <FilterProvider>
      <DataModelProvider namespace={namespace}>
        <NamespacedPage
          variant={namespacedPageVariant}
          onNamespaceChange={handleNamespaceChange}
          hideProjects={hideProjects}
          toolbar={<TopologyPageToolbar viewType={viewType} onViewChange={onViewChange} />}
          data-test-id={
            viewType === TopologyViewType.graph ? 'topology-graph-page' : 'topology-list-page'
          }
        >
          <PageContentsWithStartGuide match={match} viewType={viewType} />
        </NamespacedPage>
      </DataModelProvider>
    </FilterProvider>
  );
};

export default withFallback(TopologyPage, ErrorBoundaryFallbackPage);
