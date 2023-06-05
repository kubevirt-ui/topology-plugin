import { useMemo } from 'react';

import { DetailsTab, isDetailsTab } from '@openshift-console/dynamic-plugin-sdk';

import { orderExtensionBasedOnInsertBeforeAndAfter } from '../../ActionMenu/components/ActionMenuContent/utils/utils';

export const useDetailsTab = (): DetailsTab['properties'][] => {
  const extensions = useExtensions<DetailsTab>(isDetailsTab);
  const ordered = useMemo<DetailsTab['properties'][]>(
    () =>
      orderExtensionBasedOnInsertBeforeAndAfter<DetailsTab['properties']>(
        extensions.map(({ properties }) => properties),
      ),
    [extensions],
  );
  return ordered;
};
