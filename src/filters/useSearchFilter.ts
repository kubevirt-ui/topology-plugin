import { useMemo } from 'react';
import * as fuzzy from 'fuzzysearch';
import { toLower } from 'lodash';

import useQueryParams from '@topology-utils/hooks/useQueryParams';

const fuzzyCaseInsensitive = (a: string, b: string): boolean => fuzzy(toLower(a), toLower(b));
const useSearchFilter = (
  name: string,
  labels: { [key: string]: string } = {},
): [boolean, string] => {
  const queryParams = useQueryParams();
  const searchQuery = queryParams.get('searchQuery');
  const labelsQuery = useMemo(() => queryParams.get('labels')?.split(',') ?? [], [queryParams]);
  const labelsString = Object.entries(labels).map((label) => label.join('='));

  const labelsMatched = useMemo(
    () => labelsQuery.every((label) => labelsString.includes(label)),
    [labelsQuery, labelsString],
  );
  const filtered = useMemo(() => fuzzyCaseInsensitive(searchQuery, name), [searchQuery, name]);
  return [(filtered && !!searchQuery) || (labelsMatched && labelsQuery.length > 0), searchQuery];
};

export { useSearchFilter };
