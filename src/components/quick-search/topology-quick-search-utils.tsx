import React, { useContext, useMemo } from 'react';

import { CatalogItem } from '@openshift-console/dynamic-plugin-sdk';
import { QuickStart, QuickStartContext, QuickStartContextValues } from '@patternfly/quickstarts';
import { TextList, TextListItem } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

export const useTransformedQuickStarts = (quickStarts: QuickStart[]): CatalogItem[] => {
  const { setActiveQuickStart } = useContext<QuickStartContextValues>(QuickStartContext);
  const { t } = useTopologyTranslation();
  return useMemo(
    () =>
      quickStarts.map((qs: QuickStart) => {
        const prerequisites = qs.spec.prerequisites?.filter((p) => p);
        const description = (
          <>
            <p>{qs.spec.description}</p>
            {prerequisites?.length > 0 && (
              <>
                <h5>{t('Prerequisites')}</h5>
                <TextList>
                  {prerequisites.map((prerequisite, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <TextListItem key={index}>{prerequisite}</TextListItem>
                  ))}
                </TextList>
              </>
            )}
          </>
        );
        return {
          name: qs.spec.displayName,
          type: t('Quick Starts'),
          uid: qs.metadata.uid,
          cta: {
            callback: () => setActiveQuickStart(qs.metadata.name, qs.spec.tasks?.length),
            label: t('Start'),
          },
          icon: {
            url: qs.spec.icon as string,
          },
          description,
        };
      }),
    [t, quickStarts, setActiveQuickStart],
  );
};
