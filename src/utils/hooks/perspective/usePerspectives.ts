import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  isPerspective,
  Perspective as PerspectiveExtension,
} from '@openshift-console/dynamic-plugin-sdk';
import { LoadedExtension } from '@openshift-console/dynamic-plugin-sdk/lib/types';
import {
  Perspective,
  PerspectiveVisibilityState,
} from '@topology-utils/hooks/perspective/utils/types';
import { hasReviewAccess } from '@topology-utils/hooks/perspective/utils/utils';

const usePerspectives = (): LoadedExtension<PerspectiveExtension>[] => {
  const perspectiveExtensions = useExtensions<PerspectiveExtension>(isPerspective);
  const [results, setResults] = useState<Record<string, boolean>>(() => {
    let obj: Record<string, boolean> = {};
    if (!(window as any).SERVER_FLAGS.perspectives) {
      obj = perspectiveExtensions.reduce(
        (acc: Record<string, boolean>, ex: LoadedExtension<PerspectiveExtension>) => {
          acc[ex.properties.id] = true;
          return acc;
        },
        {},
      );
    } else {
      const perspectives: Perspective[] = JSON.parse((window as any).SERVER_FLAGS.perspectives);
      obj = perspectiveExtensions.reduce((acc, perspectiveExtension) => {
        const perspective = perspectives?.find((p) => p.id === perspectiveExtension.properties.id);

        if (
          !perspective?.visibility?.state ||
          perspective.visibility.state === PerspectiveVisibilityState.Enabled
        ) {
          acc[perspectiveExtension.properties.id] = true;
        } else if (perspective?.visibility?.state === PerspectiveVisibilityState.Disabled) {
          acc[perspectiveExtension.properties.id] = false;
        }
        return acc;
      }, {});
    }
    return obj;
  });

  const handleResults = useCallback(
    (id: string, newState: boolean) => {
      setResults((oldResults: Record<string, boolean>) => {
        if (oldResults[id] === newState) {
          return oldResults;
        }
        return {
          ...oldResults,
          [id]: newState,
        };
      });
    },
    [setResults],
  );
  useEffect(() => {
    if ((window as any).SERVER_FLAGS.perspectives) {
      const perspectives: Perspective[] = JSON.parse((window as any).SERVER_FLAGS.perspectives);
      perspectiveExtensions.forEach((perspectiveExtension) => {
        const perspective = perspectives?.find((p) => p.id === perspectiveExtension.properties.id);

        if (
          !perspective ||
          !perspective.visibility ||
          perspective.visibility.state === PerspectiveVisibilityState.Enabled
        ) {
          handleResults(perspectiveExtension.properties.id, true);
        } else if (perspective.visibility.state === PerspectiveVisibilityState.Disabled) {
          handleResults(perspectiveExtension.properties.id, false);
        } else if (
          perspective?.visibility?.state === PerspectiveVisibilityState.AccessReview &&
          perspective?.visibility?.accessReview &&
          Object.keys(perspective?.visibility?.accessReview)?.length > 0
        ) {
          hasReviewAccess(perspective?.visibility?.accessReview)
            .then((res) => {
              handleResults(perspectiveExtension.properties.id, res);
            })
            .catch((e) => {
              handleResults(perspectiveExtension.properties.id, true);
              // eslint-disable-next-line no-console
              console.warn('Could not check access', e);
            });
        }
      });
    }
  }, [perspectiveExtensions, handleResults]);
  const perspectives = useMemo(() => {
    if (!(window as any).SERVER_FLAGS.perspectives) {
      return perspectiveExtensions;
    }

    const filteredExtensions = perspectiveExtensions.filter((e) => results[e.properties.id]);

    return filteredExtensions.length === 0 &&
      Object.keys(results).length === perspectiveExtensions.length
      ? perspectiveExtensions.filter((p) => p.properties.id === 'admin')
      : filteredExtensions;
  }, [perspectiveExtensions, results]);
  return perspectives;
};

export default usePerspectives;
