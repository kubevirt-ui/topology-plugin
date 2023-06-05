import React, { FC, useCallback, useMemo, useState } from 'react';

import {
  AdapterDataType,
  BuildAdapter,
  DetailsTabSectionExtensionHook,
  isBuildAdapter,
  useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';
import { BuildConfigData } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { GraphElement } from '@patternfly/react-topology';

import TopologySideBarTabSection from '../side-bar/TopologySideBarTabSection';

import BuildOverview from './BuildOverview/BuildOverview';
import ResolveAdapter from './ResolveAdapter';
import { getDataFromAdapter } from './utils';

const BuildTabSection: FC<{
  id: string;
  buildAdapter: AdapterDataType<BuildConfigData>;
  extensionsResolved: boolean;
}> = ({ id, buildAdapter, extensionsResolved }) => {
  const [{ data: buildConfigs, loaded: buildConfigsDataLoaded }, setBuildConfigsData] = useState<{
    data?: BuildConfigData;
    loaded: boolean;
  }>({ loaded: false });
  const handleAdapterResolved = useCallback((data) => {
    setBuildConfigsData({ data, loaded: true });
  }, []);

  return buildAdapter ? (
    <TopologySideBarTabSection>
      {extensionsResolved && (
        <ResolveAdapter<BuildConfigData>
          key={id}
          resource={buildAdapter.resource}
          useAdapterHook={buildAdapter.provider}
          onAdapterDataResolved={handleAdapterResolved}
        />
      )}
      {buildConfigsDataLoaded && <BuildOverview buildConfigs={buildConfigs.buildConfigs} />}
    </TopologySideBarTabSection>
  ) : null;
};

export const useBuildsSideBarTabSection: DetailsTabSectionExtensionHook = (
  element: GraphElement,
) => {
  const [buildAdapterExtensions, extensionsResolved] =
    useResolvedExtensions<BuildAdapter>(isBuildAdapter);
  const buildAdapter = useMemo(
    () =>
      getDataFromAdapter<AdapterDataType<BuildConfigData>, BuildAdapter>(element, [
        buildAdapterExtensions,
        extensionsResolved,
      ]),
    [buildAdapterExtensions, element, extensionsResolved],
  );
  if (!buildAdapter) {
    return [undefined, true, undefined];
  }
  const section = (
    <BuildTabSection
      id={element.getId()}
      buildAdapter={buildAdapter}
      extensionsResolved={extensionsResolved}
    />
  );
  return [section, true, undefined];
};
