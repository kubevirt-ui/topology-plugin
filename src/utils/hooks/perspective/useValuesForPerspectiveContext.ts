import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { PerspectiveType } from '@openshift-console/dynamic-plugin-sdk';
import useLastPerspective from '@topology-utils/hooks/perspective/useLastPerspective';
import usePerspectiveExtension from '@topology-utils/hooks/perspective/usePerspectiveExtension';
import usePerspectives from '@topology-utils/hooks/perspective/usePerspectives';
import usePreferredPerspective from '@topology-utils/hooks/perspective/usePreferredPerspective';
import { ACM_PERSPECTIVE_ID } from '@topology-utils/hooks/perspective/utils/const';
import useTelemetry from '@topology-utils/hooks/useTelemetry/useTelemetry';

const useValuesForPerspectiveContext = (): [
  PerspectiveType,
  (newPerspective: string) => void,
  boolean,
] => {
  const history = useHistory();
  const fireTelemetryEvent = useTelemetry();
  const perspectiveExtensions = usePerspectives();
  const [lastPerspective, setLastPerspective, lastPerspectiveLoaded] = useLastPerspective();
  const [preferredPerspective, , preferredPerspectiveLoaded] = usePreferredPerspective();
  const [activePerspective, setActivePerspective] = useState('');
  const loaded = lastPerspectiveLoaded && preferredPerspectiveLoaded;
  const latestPerspective = loaded && (preferredPerspective || lastPerspective);
  const acmPerspectiveExtension = usePerspectiveExtension(ACM_PERSPECTIVE_ID);
  const existingPerspective = activePerspective || latestPerspective;
  const perspective =
    !!acmPerspectiveExtension && !existingPerspective ? ACM_PERSPECTIVE_ID : existingPerspective;
  const isValidPerspective =
    loaded && perspectiveExtensions.some((p) => p.properties.id === perspective);

  const setPerspective = (newPerspective: string) => {
    setLastPerspective(newPerspective);
    setActivePerspective(newPerspective);
    // Navigate to root and let the default page determine where to go to next
    history.push('/');
    fireTelemetryEvent('Perspective Changed', { perspective: newPerspective });
  };

  return [isValidPerspective ? perspective : undefined, setPerspective, loaded];
};

export default useValuesForPerspectiveContext;
