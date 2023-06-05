import { getLabelsAsString } from '@topology-utils';
import { KeyEventModes } from '@topology-utils/hooks/useDocumentListener/utils/types';

export const labelParser = (resources: any[], labelPath: string): Set<string> => {
  return resources.reduce((acc: Set<string>, resource: any) => {
    getLabelsAsString(resource, labelPath).forEach((label) => acc.add(label));
    return acc;
  }, new Set<string>());
};

export const suggestionBoxKeyHandler = {
  Escape: KeyEventModes.HIDE,
};
