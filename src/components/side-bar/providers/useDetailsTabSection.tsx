import { useMemo } from 'react';

import {
  DetailsTabSection,
  isDetailsTabSection,
  ResolvedExtension,
  useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';

import { orderExtensionBasedOnInsertBeforeAndAfter } from '../../ActionMenu/components/ActionMenuContent/utils/utils';

export const useDetailsTabSection = (): [
  ResolvedExtension<DetailsTabSection>['properties'][],
  boolean,
] => {
  const [extensions, resolved] = useResolvedExtensions<DetailsTabSection>(isDetailsTabSection);
  const ordered = useMemo<ResolvedExtension<DetailsTabSection>['properties'][]>(
    () =>
      resolved
        ? orderExtensionBasedOnInsertBeforeAndAfter<
            ResolvedExtension<DetailsTabSection>['properties']
          >(extensions.map(({ properties }) => properties))
        : [],
    [extensions, resolved],
  );
  return [ordered, resolved];
};
