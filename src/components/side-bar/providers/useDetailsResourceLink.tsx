import { Component, useMemo } from 'react';

import {
  DetailsResourceLink,
  isDetailsResourceLink,
  useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';

export const useDetailsResourceLink = (element: GraphElement): Component | null | undefined => {
  const [resurceLinkExtension, resolved] =
    useResolvedExtensions<DetailsResourceLink>(isDetailsResourceLink);
  const resourceLink = useMemo(() => {
    return resolved
      ? resurceLinkExtension
          .sort((a, b) => b.properties.priority - a.properties.priority)
          .find(({ properties: { link } }) => !!link(element))
          ?.properties?.link?.(element)
      : null;
  }, [resurceLinkExtension, resolved, element]);
  return resourceLink;
};
