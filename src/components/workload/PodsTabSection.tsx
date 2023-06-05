import React, { FC, useCallback, useMemo, useState } from 'react';

import {
  AdapterDataType,
  DetailsTabSectionExtensionHook,
  isPodAdapter,
  PodAdapter,
  PodsAdapterDataType,
  useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { PodKind } from '@topology-utils/types/podTypes';

import PodsOverviewContent from '../common/PodsOverviewContent/PodsOverviewContent';
import TopologySideBarTabSection from '../side-bar/TopologySideBarTabSection';

import ResolveAdapter from './ResolveAdapter';
import { getDataFromAdapter } from './utils';

const PodsTabSection: FC<{
  id: string;
  podAdapter: AdapterDataType<PodsAdapterDataType<PodKind>>;
  podAdapterExtensionResolved: boolean;
}> = ({ id, podAdapter, podAdapterExtensionResolved }) => {
  const [{ data: podsData, loaded: podsDataLoaded }, setPodData] = useState<{
    data?: PodsAdapterDataType<PodKind>;
    loaded: boolean;
  }>({ loaded: false });

  const handleAdapterResolved = useCallback((data) => {
    setPodData({ data, loaded: true });
  }, []);

  return podAdapter ? (
    <TopologySideBarTabSection>
      {podAdapterExtensionResolved && (
        <ResolveAdapter<PodsAdapterDataType<PodKind>>
          key={id}
          resource={podAdapter.resource}
          data={podAdapter.data}
          useAdapterHook={podAdapter.provider}
          onAdapterDataResolved={handleAdapterResolved}
        />
      )}
      {podsDataLoaded && podsData.loaded && !podsData.loadError && (
        <PodsOverviewContent obj={podAdapter.resource} {...podsData} />
      )}
    </TopologySideBarTabSection>
  ) : null;
};

export const usePodsSideBarTabSection: DetailsTabSectionExtensionHook = (element: GraphElement) => {
  const [podAdapterExtension, podAdapterExtensionResolved] =
    useResolvedExtensions<PodAdapter>(isPodAdapter);
  const podAdapter = useMemo(
    () =>
      getDataFromAdapter<AdapterDataType<PodsAdapterDataType<PodKind>>, PodAdapter>(element, [
        podAdapterExtension,
        podAdapterExtensionResolved,
      ]),
    [element, podAdapterExtension, podAdapterExtensionResolved],
  );
  if (!podAdapter) {
    return [undefined, true, undefined];
  }
  const section = (
    <PodsTabSection
      id={element.getId()}
      podAdapter={podAdapter}
      podAdapterExtensionResolved={podAdapterExtensionResolved}
    />
  );
  return [section, true, undefined];
};
