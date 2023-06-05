import { useMemo } from 'react';

import { Perspective as PerspectiveExtension } from '@openshift-console/dynamic-plugin-sdk';
import { LoadedExtension } from '@openshift-console/dynamic-plugin-sdk/lib/types';
import usePerspectives from '@topology-utils/hooks/perspective/usePerspectives';

const usePerspectiveExtension = (id: string): LoadedExtension<PerspectiveExtension> => {
  const perspectiveExtensions = usePerspectives();
  return useMemo(
    () => perspectiveExtensions.find((e) => e.properties.id === id),
    [id, perspectiveExtensions],
  );
};

export default usePerspectiveExtension;
