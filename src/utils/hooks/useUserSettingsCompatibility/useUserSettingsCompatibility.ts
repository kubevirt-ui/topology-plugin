import { Dispatch, SetStateAction, useEffect } from 'react';

import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk-internal';

import { deseralizeData } from './utils/utils';

export const useUserSettingsCompatibility = <T>(
  key: string,
  storageKey: string,
  defaultValue?: T,
  sync = false,
): [T, Dispatch<SetStateAction<T>>, boolean] => {
  const [settings, setSettings, loaded] = useUserSettings<T>(
    key,
    localStorage.getItem(storageKey) !== null
      ? deseralizeData(localStorage.getItem(storageKey))
      : defaultValue,
    sync,
  );

  useEffect(
    () => () => {
      if (loaded) {
        localStorage.removeItem(storageKey);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded],
  );

  return [settings, setSettings, loaded];
};
