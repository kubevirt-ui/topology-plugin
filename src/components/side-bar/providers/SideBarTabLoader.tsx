import React, { FC, ReactElement } from 'react';

import { GraphElement } from '@patternfly/react-topology';
import { Tab } from '@topology-utils/types/commonTypes';

import SideBarTabHookResolver from './SideBarTabHookResolver';
import { useDetailsTab } from './useDetailsTab';
import { useDetailsTabSection } from './useDetailsTabSection';

type SideBarTabLoaderProps = {
  element: GraphElement;
  children: (tabs: Tab[], loaded: boolean) => ReactElement;
};

const SideBarTabLoader: FC<SideBarTabLoaderProps> = ({ element, children }) => {
  const tabExtensions = useDetailsTab();
  const [tabSectionExtensions, tabSectionExtensionsResolved] = useDetailsTabSection();

  if (!tabSectionExtensionsResolved) {
    return children([], false);
  }

  return (
    <SideBarTabHookResolver
      element={element}
      tabExtensions={tabExtensions}
      tabSectionExtensions={tabSectionExtensions}
    >
      {children}
    </SideBarTabHookResolver>
  );
};

export default SideBarTabLoader;
